const axios = require("axios");
const path = require('path');
const fs = require('fs');
const CONSTANT = require("./constant");

const { FundURL } = CONSTANT;

const filePath = path.join(__dirname, 'src', 'resource', 'fund.js');

const getFundInfo = (fundCode) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${FundURL}${fundCode}.js`)
      .then((res) => {
        res.data ? resolve(res.data) : reject("error");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const list = [
  {
    code: "005918",
    area: "沪深300",
  },
  {
    code: "161725",
    area: "白酒",
  },
  {
    code: "012414",
    area: "白酒",
  },
  {
    code: "012043",
    area: "白酒",
  },
  {
    code: "160632",
    area: "白酒",
  },
  {
    code: "003096",
    area: "医药",
  },
  {
    code: "161726",
    area: "医药",
  },
  {
    code: "001344",
    area: "医药",
  },
  {
    code: "010366",
    area: "医药",
  },
  {
    code: "005112",
    area: "医药",
  },
  {
    code: "002978",
    area: "医药",
  },
  {
    code: "003984",
    area: "新能源",
  },
  {
    code: "012547",
    area: "银行",
  },
  {
    code: "001595",
    area: "银行",
  },
  {
    code: "004597",
    area: "银行",
  },
  {
    code: "014776",
    area: "芯片半导体",
  },
  {
    code: "014777",
    area: "芯片半导体",
  },
  {
    code: "012552",
    area: "芯片半导体",
  },
  {
    code: "004854",
    area: "乘用车",
  },
  {
    code: "004855",
    area: "乘用车",
  },
  {
    code: "011832",
    area: "ChatGPT",
  },
  {
    code: "008585",
    area: "ChatGPT",
  },
  {
    code: "008021",
    area: "ChatGPT",
  },
  {
    code: "003017",
    area: "国防军工",
  },
  {
    code: "005693",
    area: "国防军工",
  },
  {
    code: "501019",
    area: "国防军工",
  },
  {
    code: "020412",
    area: "黄金概念",
  },
  {
    code: "020411",
    area: "黄金概念",
  },
  {
    code: "002207",
    area: "黄金概念",
  },
];

// const res = [
//   {
//     fundcode: "005918",
//     name: "天弘沪深300ETF联接C",
//     jzrq: "2025-04-15",
//     dwjz: "1.1512",
//     gsz: "1.1426",
//     gszzl: "-0.75",
//     value: 75,
//     originValue: -75,
//     gztime: "2025-04-16 10:59",
//     area: "沪深300",
//   },
//   {
//     fundcode: "161725",
//     name: "招商中证白酒指数(LOF)A",
//     jzrq: "2025-04-15",
//     dwjz: "0.8176",
//     gsz: "0.8095",
//     gszzl: "-0.99",
//     value: 99,
//     originValue: -99,
//     gztime: "2025-04-16 10:58",
//     area: "baijiu",
//   },
//   {
//     fundcode: "005827",
//     name: "易方达蓝筹精选混合",
//     jzrq: "2025-04-15",
//     dwjz: "1.8184",
//     gsz: "1.7836",
//     gszzl: "-1.91",
//     value: 191,
//     originValue: -191,
//     gztime: "2025-04-16 11:00",
//     area: "baijiu",
//   },
//   {
//     fundcode: "003096",
//     name: "中欧医疗健康混合C",
//     jzrq: "2025-04-15",
//     dwjz: "1.4811",
//     gsz: "1.4608",
//     gszzl: "-1.37",
//     value: 137,
//     originValue: -137,
//     gztime: "2025-04-16 11:00",
//     area: "yiliao",
//   },
//   {
//     fundcode: "161726",
//     name: "招商国证生物医药指数(LOF)A",
//     jzrq: "2025-04-15",
//     dwjz: "0.3594",
//     gsz: "0.3521",
//     gszzl: "-2.04",
//     value: 204,
//     originValue: -204,
//     gztime: "2025-04-16 10:59",
//     area: "yiliao",
//   },
//   {
//     fundcode: "003984",
//     name: "嘉实新能源新材料股票A",
//     jzrq: "2025-04-15",
//     dwjz: "1.6675",
//     gsz: "1.6465",
//     gszzl: "-1.26",
//     value: 126,
//     originValue: -126,
//     gztime: "2025-04-16 10:59",
//     area: "energe",
//   },
// ];

const classifyByArea = (data) => {
  const areaMap = {};
  data.forEach((item) => {
    const { area, value, originValue, name } = item;
    if (!areaMap[area]) {
      areaMap[area] = {
        name: area,
        value: 0,
        originValue: 0,
        children: [],
      };
    }
    areaMap[area].value += value;
    areaMap[area].originValue += originValue;
    areaMap[area].children.push({
      name,
      value,
      originValue,
      path: `${area}/${name}`,
      itemStyle: {
        color: `${
          originValue > 0
            ? `rgba(255, 0, 0, ${Math.min(1, Math.abs(originValue) / 1000)})`
            : `rgba(0, 255, 0, ${Math.min(1, Math.abs(originValue) / 1000)})`
        }`,
      },
    });
  });

  const result = [];
  for (const area in areaMap) {
    const areaData = areaMap[area];
    result.push({
      ...areaData,
      path: area,
      itemStyle: {
        color: `${
          areaData.originValue > 0
            ? `rgba(255, 0, 0, ${Math.min(
                1,
                Math.abs(areaData.originValue) / 1000
              )})`
            : `rgba(0, 255, 0, ${Math.min(
                1,
                Math.abs(areaData.originValue) / 1000
              )})`
        }`,
      },
    });
  }
  return result;
};

const task = async () => {
  const arr = [];
  // 根据code获取数据
  for (const item of list) {
    const code = item.code;
    try {
      const res = await getFundInfo(code);
      const data = JSON.parse(
        res.substring(res.indexOf("(") + 1, res.lastIndexOf(")"))
      );
      data.area = item.area;
      data.value = Math.abs(data.gszzl * 100).toFixed() * 1; //转为计算整数
      data.originValue = (data.gszzl * 100).toFixed() * 1; //带单位整数
      arr.push(data);
    } catch (error) {
      console.error(`获取 ${code} 信息时出错:`, error);
    }
  }
  // 将arr处理成echarts矩形树图数据结构
  const result = classifyByArea(arr);
  // 写入目录
  const str = `var res = ${JSON.stringify(result, null, 2)};`
  fs.writeFile(filePath, str, 'utf8', (err) => {
    if (err) {
        console.error('写入文件时出错:', err);
    } else {
        console.log('数据已成功写入 fund.js 文件');
    }
  });
};

task();