const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const randomRgbaColor = () => {
  //随机生成RGBA颜色
  var r = Math.floor(Math.random() * 256); //随机生成256以内r值
  var g = Math.floor(Math.random() * 256); //随机生成256以内g值
  var b = Math.floor(Math.random() * 256); //随机生成256以内b值
  var alpha = Math.random(); //随机生成1以内a值
  return `rgb(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

console.log(`email name: ${process.env.EMAIL_NAME}`)

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
        console.error("邮件发送异常：", error);
        reject(error);
      } else {
        console.log("邮件发送成功", info.messageId);
        resolve();
      }
    });
  });
};

const diffDay = (year, month, day) => {
  const now = new Date()
  const endDate = new Date(year, month - 1, day)
  const leftTime = endDate.getTime() - now.getTime()
  const leftSecond = parseInt(leftTime / 1000)
  const countDay = Math.floor(leftSecond / (60 * 60 * 24)) + 1
  return countDay
};

const dateFormater = (formater, time) => {
  let date = time ? new Date(time) : new Date(),
    Y = date.getFullYear() + '',
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  return formater.replace(/YYYY|yyyy/g, Y)
    .replace(/YY|yy/g, Y.substr(2, 2))
    .replace(/MM/g, (M < 10 ? '0' : '') + M)
    .replace(/DD/g, (D < 10 ? '0' : '') + D)
    .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
    .replace(/mm/g, (m < 10 ? '0' : '') + m)
    .replace(/ss/g, (s < 10 ? '0' : '') + s)
};

const getNowSeconds = () => {
  //本地时间 + 本地时间与格林威治时间的时间差 + GMT+8与格林威治的时间差 
  return new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000)
};

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
};

const writeDataToFile = (data, filePath) => {
  ensureDirectoryExistence(filePath)
  const jsonData = JSON.stringify(data, null, 2)
  fs.writeFile(filePath, jsonData, 'utf-8', (err) => {
    if (err) {
      console.log('写入文件时出错:', err)
    } else {
      console.log('数据已成功写入文件:', filePath)
    }
  })
}

module.exports = {
  randomRgbaColor,
  getRandomColor,
  sendEmail,
  diffDay,
  dateFormater,
  getNowSeconds,
  ensureDirectoryExistence,
  writeDataToFile
}