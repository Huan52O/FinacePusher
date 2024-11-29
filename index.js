const axios = require("axios");
const nodemailer = require("nodemailer");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

const Day = dayjs().day();
const copyRight = `<p style="margin: 0;padding: 0; text-align:center; color: #ee55aa;font-size:15px; line-height: 80px;">copyright© Dearhuan 2020 All Right Reserved</p>`;
// const url = 'https://assets.msn.cn/service/Finance/Quotes?apikey=0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM&activityId=3A9B5B12-B975-4D8D-88AA-AA76DC86601B&ocid=finance-utils-peregrine&cm=zh-cn&it=edgeid&scn=APP_ANON&ids=adfh77,adg1m7,a6qja2,ah7etc,a9j7bh,a33k6h,a3oxnm,afx2kr,aopnp2,aecfh7,ahkucw,ale3jc,apnmnm,ad88mw,ad87qh,auvwoc,ad9b1h,adci1h,ad99yc,adfha2,adfif2,adfnec&wrapodata=false'
const baseUrl = "https://assets.msn.cn/service/Finance/Quotes";
const apiKey = "0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM";
const activityId = "3A9B5B12-B975-4D8D-88AA-AA76DC86601B";
const ocId = "finance-utils-peregrine";
const cm = "zh-cn";
const it = "edgeid";
const scn = "APP_ANON";
const ids = [
  "adfh77",
  "adg1m7",
  "a6qja2",
  "ah7etc",
  "a9j7bh",
  "a33k6h",
  "a3oxnm",
  "afx2kr",
  "aopnp2",
  "aecfh7",
  "ahkucw",
  "ale3jc",
  "apnmnm",
  "ad88mw",
  "ad87qh",
  "auvwoc",
  "ad9b1h",
  "adci1h",
  "ad99yc",
  "adfha2",
  "adfif2",
  "adfnec",
  "ad82lh",
  "ad7w27",
  "ad9gkr",
  "ad8ck2",
  "ad7op2",
  "ad8rnm",
  "ad8ecw",
  "ad92xm",
  "ad7hr7",
  "ada37w",
  "cf52gh",
  "ad7zpr",
  "c1rkhw",
  "awrtp2",
  "buw33m",
  "ad7tlh",
  "ada7dm",
  "ad8gbh",
  "bwm1jc",
  "cf52p2",
  "ad91yc",
  "ad9ixm",
  "az6h52",
  "ad8ff2",
  "ad8sk2",
  "ad7qf2",
  "ad9bww",
];
const wrapodata = false;

const Transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: "clearhuan@qq.com",
    pass: "eouspdhfamtybbdd",
  },
});

const sendEmail = (transporter, to, html, subject) => {
  return new Promise((resolve, reject) => {
    const option = {
      from: `<clearhuan@qq.com>`,
      to: `<${to}>`,
      subject,
      html,
    };
    transporter.sendMail(option, (error, info = {}) => {
      if (error) {
        console.error("邮件发送异常：", err);
        reject(error);
      } else {
        console.log("邮件发送成功", info.messageId);
        resolve();
      }
    });
  });
};

const randomRgbaColor = () => {
  //随机生成RGBA颜色
  var r = Math.floor(Math.random() * 256); //随机生成256以内r值
  var g = Math.floor(Math.random() * 256); //随机生成256以内g值
  var b = Math.floor(Math.random() * 256); //随机生成256以内b值
  var alpha = Math.random(); //随机生成1以内a值
  return `rgb(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
};

const getFinaceInfo = () => {
  const params = {
    apikey: apiKey,
    activityId: activityId,
    ocid: ocId,
    cm: cm,
    it: it,
    scn: scn,
    ids: ids.join(","),
    wrapodata: wrapodata,
  };
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl, {
        params: params,
      })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createFinaceHtml = async () => {
  try {
    const finaceList = await getFinaceInfo();
    console.log(finaceList);

    let trendStr = "";
    if (finaceList.length > 0) {
      finaceList.forEach((ele) => {
        trendStr += `<div style="display:flex;justify-content:space-between;align-items:center;">
                <p style="width:330px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><span style="margin:0 15px;font-size:16px;font-weight:700;color:#f26d5f">${
                  ele[0].symbol
                }</span><a style="color:#00c3ff;text-decoration: none;">${
          ele[0].localizedAttributes["zh-cn"].shortName
        } ${ele[0].price}</a></p>
                <p style="color:${
                  ele[0].priceChange > 0 ? "#ff2525" : "#37e91a"
                };margin-right:15px"><span>${
          ele[0].priceChange > 0
            ? `+${ele[0].priceChange}`
            : `${ele[0].priceChange}`
        } </span><span>${
          ele[0].priceChange > 0
            ? `+${ele[0].priceChangePercent.toFixed(2)}`
            : `${ele[0].priceChangePercent.toFixed(2)}`
        }%</span></p>
              </div>`;
      });
    }
    const html = `<div style="background: linear-gradient(90deg, #124998, transparent);box-shadow: ${randomRgbaColor()} 0px 0px 10px;border-radius: 40px;">
                    <div style="
                    font-weight: bold;
                    color: #fff;
                    text-align: center;
                    padding: 20px;
                    font-size: 20px;">Fund Tips</div>
                    ${trendStr}
                    ${copyRight}
                  </div>`;
    sendEmail(
      Transporter,
      "hellohehuan@126.com",
      html,
      "【Finace Notice】By Github Actions"
    );
  } catch (error) {
    console.error(error);
  }
};

![0, 6].includes(Day) && createFinaceHtml();
