const axios = require("axios");
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
                <div style="color: #ABB3BC;font-size: 24px;width: 50px;text-align: center;">${item.name}</div>
                <div style="flex: 1; text-align: right; color: #124998; font-size: 18px; font-weight: bold;">${item.price}</div>
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

![0, 6].includes(Day) && createOilHtml();