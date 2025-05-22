const axios = require("axios");
const fs = require('fs');
const util = require('./util');
const path = require('path');
const CONSTANT = require('./constant');

const {
  Day, 
  Time,
  OilInfo
} = CONSTANT;

const {
  OilUrl,
  OilKey,
  OilCity,
  OilMapping
} = OilInfo;

const OilDataPath = path.join(__dirname, 'src', 'resource', 'oilData.json');

const {  
  sendEmail,
  dateFormater,
  getNowSeconds 
} = util;

const getOilInfo = () => {
  const params = {
    key: OilKey,
  };
  return new Promise((resolve, reject) => {
    axios
      .get(OilUrl, {
        params: params,
      })
      .then((res) => {
        res.data.error_code === 0 ? resolve(res.data.result) : resolve([])
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const classifyByArea = (data) => {
  const areaMap = {};
  data.forEach(item => {
    const { city } = item;
    const h92 = Number(item['92h'])
    const h95 = Number(item['95h'])
    const h98 = Number(item['98h'])
    const h0 = Number(item['0h'])
    if (!areaMap[city]) {
      areaMap[city] = {
        name: city,
        value: 0,
        children: [
          {
            name: '92h',
            value: h92,
            path: `${city}/92h`
          },
          {
            name: '95h',
            value: h95,
            path: `${city}/95h`
          },
          {
            name: '98h',
            value: h98,
            path: `${city}/98h`
          },
          {
            name: '0h',
            value: h0,
            path: `${city}/0h`
          },
        ]
      }
    }
    areaMap[city].value += (h92 + h95 + h98 + h0);
  });
  const result = [];
  for (const area in areaMap) {
    const areaData = areaMap[area];
    const childrenCount = areaData.children.length;
    const totalValue = areaData.children.reduce((sum, child) => sum + child.value, 0)
    areaData.value = (totalValue / childrenCount).toFixed(2) * 1
    result.push({
      ...areaData,
      path: area
    })
  };
  return result;
};

const readOilData = () => {
  try {
    return fs.readFileSync(OilDataPath, 'utf-8');
  } catch (error) {
    console.error('读取文件时出错:', error);
    return null;
  }
};

const transformPriceChange = (change) => {
  if (change > 0) {
    return `↑${change}`
  } else if (change < 0) {
    return `↓${change}`
  } else if (change == 0) {
    return ''
  }
};

const createOilHtml = async () => {
  try {
    const result = await getOilInfo();
    const oilRes = classifyByArea(result);
    const filePath = path.join(__dirname, 'src', 'resource', 'oilRes.js')
    const oilResStr = `var oils = ${JSON.stringify(oilRes, null, 2)}`
    fs.writeFile(filePath, oilResStr, 'utf-8', (err) => {
      if (err) {
        console.log('写入文件时出错：', err)
      } else {
        console.log('数据写入成功')
      }
    })
    const resultGd = result.filter(item => {
      return item.city === OilCity
    })[0];
    const { last, current } = JSON.parse(readOilData());
    const readOil = {
      last: last,
      current: current
    };
    if (current['92h'] != resultGd['92h']) {
      // 更新last, current
      readOil = {
        "last": {
           "92h": current['92h'],
           "95h": current['95h'],
           "98h": current['98h'],
           "0h": current['0h']
         },
         "current": {
           "92h": resultGd['92h'],
           "95h": resultGd['95h'],
           "98h": resultGd['98h'],
           "0h": resultGd['0h']
         }
      };
      const jsonData = JSON.stringify(readOil, null, 2)
      fs.writeFile(OilDataPath, jsonData, 'utf-8', (err) => {
        if (err) {
          console.log('写入文件时出错:', err)
        } else {
          console.log('数据已成功写入文件:', OilDataPath)
        }
      })
    };
    const list = [];
    for (const key in OilMapping) {
      if (OilMapping.hasOwnProperty(key)) {
        list.push({
          price: resultGd[key],
          name: OilMapping[key].name,
          flag: OilMapping[key].flag,
          desc: OilMapping[key].desc,
          color: OilMapping[key].color,
          change: readOil.current[key] - readOil.last[key]
        })
      }
    }

    const html = `
      <div style="background: #0a0e1a; color: #ffffff; line-height: 1.2; margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px 20px;">
        <header style="text-align: center; padding: 40px 0;">
          <h1 style="font-size: 2.0em; font-weight: 700; background: linear-gradient(45deg, #00f2fe, #4facfe); -webkit-background-clip: text; letter-spacing: 2px; text-shadow: 0 2px 8px rgba(79,172,254,0.3);">⛽智慧能源价格速报</h1>
        </header>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          ${list.map(item => {
            return `<div style="padding: 35px; border-radius: 15px; text-align: center; position: relative; overflow: hidden; transition: transform 0.3s ease; background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border: 2px solid ${item.color};">
                      <div style="position: relative; font-size: 1.6em; font-weight: 600; margin-bottom: 15px;">${item.name}</div>
                      <div style="font-size: 2.2em; font-weight: 700; color: #ffffff; text-shadow: 0 2px 6px rgba(255,255,255,0.2);">${item.price}<span style="font-size: 0.6em; color: #aab2c0;">元/L</span></div>
                      <div style="content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 20%, rgba(79,172,254,0.3) 50%, transparent 80%); animation: rotate 6s linear infinite;"></div>
                    </div>`
          }).join('')}
        </div>
        <footer style="text-align: center; padding: 40px 0 20px; color: #6d7a8f; font-size: 0.9em;">
          <p>© 2025 能源数据观察中心 | 数据更新于 ${Time}</p>
          <p style="margin-top:8px">数据来源：国家发改委价格监测中心</p>
        </footer>
      </div>`;

    const ohtml = `
    <div style="margin: 0 auto; background-color: white; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="position: relative; background-color: #165DFF; height: 100px; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to right, #165DFF, #3b82f6); opacity: 0.9;"></div>
        <div style="position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; background-color: white; border-radius: 50%;"></div>
        <div style="position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); padding: 0 24px;">
            <h1 style="font-size: clamp(1.5rem, 5vw, 2rem); font-weight: bold; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; margin: 0;">
                <i class="fa-solid fa-gas-pump" style="margin-right: 8px;"></i>能源信息快报
            </h1>
        </div>
      </div>       
      <!-- 日期和更新信息 -->
      <div style="padding: 0 24px; margin-top: -16px;">
        <div style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 12px; color: #64748b;">
                <i class="fa-regular fa-calendar" style="margin-right: 4px;"></i>
                <span>${dateFormater('YYYY年MM月DD日', getNowSeconds())}</span>
            </div>
            <div style="font-size: 12px; color: #165DFF; font-weight: 500;">
                <i class="fa-solid fa-clock-rotate-left" style="margin-right: 4px;"></i>
                <span>${dateFormater('HH:mm:ss', getNowSeconds())}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 0 24px; margin-top: 16px;">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">油价详情</h2>       
        ${list.map(item => {
          return `
          <div style="margin-bottom: 16px; transition: transform 0.3s ease, box-shadow 0.3s ease;">
            <div style="background-color: rgba(22, 93, 255, 0.05); border-radius: 16px; padding: 16px; display: flex; align-items: center;">
              <div style="background-color: #165DFF; color: white; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; margin-right: 16px; font-weight: bold;">
                  ${item.flag}
              </div>
              <div style="flex: 1;">
                  <div style="font-weight: 600;">${item.name}</div>
                  <div style="font-size: 12px; color: #64748b;">${item.desc}</div>
              </div>
              <div style="text-align: right;">
                  <div style="font-size: 20px; font-weight: bold; color: ${item.color};">¥${item.price}</div>
                  <div style="font-size: 10px; color: ${item.change > 0 ? `#FF6B35` : `#22c55e`};">${transformPriceChange(item.change)}</div>
              </div>
            </div>
          </div>`
        }).join('')}
      </div>
      <div style="background-color: #1E293B; color: white; padding: 24px; margin-top: 24px;">
        <div style="text-align: center;">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">油价信息快报</div>
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">
              每日为您提供最新油价资讯
          </p>
          <div style="font-size: 10px; color: #64748b;">
              <p>© 2025 油价信息快报</p>
              <p style="margin-top: 4px;">本邮件由系统自动发送，请勿回复</p>
          </div>
        </div>
      </div>
    </div>`;

    sendEmail(
      "hellohehuan@126.com",
      html,
      "【Oil Notice】By Github Actions"
    );
  } catch (error) {
    console.error(error);
  }
};

![0, 6].includes(Day) && createOilHtml();