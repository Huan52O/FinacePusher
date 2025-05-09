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

const {  
  sendEmail 
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
    const list = [];
    for (const key in OilMapping) {
      if (OilMapping.hasOwnProperty(key)) {
        list.push({
          price: resultGd[key],
          name: OilMapping[key].name,
          color: OilMapping[key].color
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