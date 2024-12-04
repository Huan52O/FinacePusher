const nodemailer = require('nodemailer');
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

const Day = dayjs().day();

const CM = 'zh-cn';
const IT = 'edgeid';
const SCN = 'APP_ANON';

const FinaceUrl = 'https://assets.msn.cn/service/Finance/Quotes';
const FinaceApiKey = '0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM';
const FinaceActivityId = '3A9B5B12-B975-4D8D-88AA-AA76DC86601B';
const FinaceOcId = 'finace-utils-peregrine';
const FinaceIds = [
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
const FinaceWrapodata = false;

const NbaUrl = 'https://api.msn.com/sports/standings';
const NbaApiKey = 'kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ';
const NbaVersion = '1.0';
const NbaActivityId = '3AB4409B-6BFA-43E5-BAFC-DEB35EDBF67C';
const NbaOcId = 'sports-league-standings';
const NbaUser = 'm-35F7F230E9F8605C12D5E779E8CC6194';
const NbaId = 'Basketball_NBA';
const NbaIdType = 'league';
const NbaSeasonPhase = 'regularSeason';

const CopyRight = `<p style="margin: 0;padding: 0; text-align:center; color: #ee55aa;font-size:15px; line-height: 80px;">copyright© Dearhuan 2020 All Right Reserved</p>`;

const randomRgbaColor = () => {
  //随机生成RGBA颜色
  var r = Math.floor(Math.random() * 256); //随机生成256以内r值
  var g = Math.floor(Math.random() * 256); //随机生成256以内g值
  var b = Math.floor(Math.random() * 256); //随机生成256以内b值
  var alpha = Math.random(); //随机生成1以内a值
  return `rgb(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
};

const Transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: "clearhuan@qq.com",
    pass: "eouspdhfamtybbdd",
  },
});

const sendEmail = (to, html, subject) => {
  return new Promise((resolve, reject) => {
    const option = {
      from: `<clearhuan@qq.com>`,
      to: `<${to}>`,
      subject,
      html,
    };
    Transporter.sendMail(option, (error, info = {}) => {
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

module.exports = {
  Day,
  CopyRight,
  CM,
  IT,
  SCN,
  FinaceUrl,
  FinaceApiKey,
  FinaceActivityId,
  FinaceOcId,
  FinaceIds,
  FinaceWrapodata,
  NbaUrl,
  NbaApiKey,
  NbaActivityId,
  NbaVersion,
  NbaOcId,
  NbaUser,
  NbaId,
  NbaIdType,
  NbaSeasonPhase,
  randomRgbaColor,
  sendEmail
}