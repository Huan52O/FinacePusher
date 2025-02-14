const axios = require("axios");
const { createCanvas } = require('canvas');
const Chart = require('chart.js/auto');
const util = require('./util');
const CONSTANT = require('./constant');

const {
  Day, 
  CopyRight,
  OilInfo
} = CONSTANT;

const {
  OilUrl,
  OilKey,
  OilCity
} = OilInfo;

const { 
  randomRgbaColor, 
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

const createOilHtml = async () => {
  try {
    const result = await getOilInfo();
    const resultGd = result.filter(item => {
      return item.city === OilCity
    })[0];
    const list = [
      {
        price: resultGd['92h'],
        name: '92汽油'
      },
      {
        price: resultGd['95h'],
        name: '95汽油'
      },
      {
        price: resultGd['98h'],
        name: '98汽油'
      },
      {
        price: resultGd['0h'],
        name: '0柴油'
      },
    ]

    let oilStr = '';
    list.forEach((item) => {
      oilStr += `<div style="display: flex;align-items: center;margin-bottom: 5px;">
                <div style="color: #ABB3BC;font-size: 24px;padding: 0 10px;text-align: center;">${item.name}</div>
                <div style="flex: 1; text-align: right; color: #124998;padding: 0 10px; font-size: 18px; font-weight: bold;">${item.price}</div>
              </div>`
    });

    const html = `<div style="background: linear-gradient(90deg, #124998, transparent);box-shadow: ${randomRgbaColor()} 0px 0px 10px;border-radius: 40px;">
                    <div style="
                    font-weight: bold;
                    color: #fff;
                    text-align: center;
                    padding: 20px;
                    font-size: 20px;">Oil Notice</div>
                    ${oilStr}
                    ${CopyRight}
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

// ![0, 6].includes(Day) && createOilHtml();

const oilPrices = [
  { date: '2024-01-01', price: 70 },
  { date: '2024-02-01', price: 72 },
  { date: '2024-03-01', price: 75 },
  { date: '2024-04-01', price: 73 },
  { date: '2024-05-01', price: 76 }
];

// 提取日期和价格数据
const dates = oilPrices.map((item) => item.date);
const prices = oilPrices.map((item) => item.price);

// 创建画布
const canvas = createCanvas(800, 600);
const ctx = canvas.getContext("2d");

// 创建图表
new Chart(ctx, {
  type: "line",
  data: {
    labels: dates,
    datasets: [
      {
        label: "油价走势",
        data: prices,
        borderColor: "blue",
        fill: false,
      },
    ],
  },
  options: {
    responsive: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "日期",
        },
      },
      y: {
        title: {
          display: true,
          text: "油价（美元/桶）",
        },
      },
    },
  },
});

// 将图表转换为 Base64 编码
const imageBase64 = canvas.toDataURL("image/png").split(";base64,").pop();
const html = `<p>这是最近的油价走势图表：</p><img src="data:image/png;base64,${imageBase64}" alt="油价走势图表">`

sendEmail(
  "hellohehuan@126.com",
  html,
  "【Oil Notice】By Github Actions"
);