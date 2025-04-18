const utils = require('./util');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'resource', 'dayRes.js');

const { diffDay, getNowSeconds, dateFormater } = utils;

const formatRes = (res) => {
  return res.map(item => {
    return {
      name: item.name,
      value: item.days,
      path: item.name,
      date: item.date
    }
  })
}

const updateCountDayTask = () => {
  const year = dateFormater('YYYY', getNowSeconds()) * 1
  const month = dateFormater('MM', getNowSeconds()) * 1
  console.log(year, month)
  // 车贷
  const carDay = diffDay(2026, 4, 24)
  // 花呗
  const alipayDay = diffDay(year, month, 25) < 0 ? diffDay(year, month + 1, 25) : diffDay(year, month, 25)
  // 广发
  const guangfaDay = diffDay(year, month, 24) < 0 ? diffDay(year, month + 1, 24) : diffDay(year, month, 24)
  // 车贷(月)
  const carLoanDay = diffDay(year, month, 24) < 0 ? diffDay(year, month + 1, 24) : diffDay(year, month, 24)
  // 招行
  const zhaohangDay = diffDay(year, month, 6) < 0 ? diffDay(year, month + 1, 6) : diffDay(year, month, 6)
  // 光大
  const guangdaDay = diffDay(year, month, 10) < 0 ? diffDay(year, month + 1, 10) : diffDay(year, month, 10)
  // 情人节
  const qingrenDay = diffDay(year, 2, 14 ) < 0 ? diffDay(year + 1, 2, 14) : diffDay(year, 2, 14)
  // 妇女节
  const funvDay = diffDay(year, 3, 8) < 0 ? diffDay(year + 1, 3, 8) : diffDay(year, 3, 8)
  // 清明节
  const qingmingDay = diffDay(year, 4, 4) < 0 ? diffDay(year + 1, 4, 4) : diffDay(year, 4, 4)
  // 劳工节
  const laodongDay = diffDay(year, 5, 1) < 0 ? diffDay(year + 1, 5, 1) : diffDay(year, 5, 1)
  // 青年节
  const qingnianDay = diffDay(year, 5, 4) < 0 ? diffDay(year + 1, 5, 4) : diffDay(year, 5, 4)
  // 儿童节
  const ertongDay = diffDay(year, 6, 1) < 0 ? diffDay(year + 1, 6, 1) : diffDay(year, 6, 1)
  // 建党
  const jiandangDay = diffDay(year, 7, 1) < 0 ? diffDay(year + 1, 7, 1) : diffDay(year, 7, 1)
  // 建军
  const jianjunDay = diffDay(year, 8, 1) < 0 ? diffDay(year + 1, 8, 1) : diffDay(year, 8, 1)
  // 国庆
  const guoqingDay = diffDay(year, 10, 1) < 0 ? diffDay(year + 1, 10, 1) : diffDay(year, 10, 1)
  // 平安夜、圣诞节
  const pinganDay = diffDay(year, 12, 24) < 0 ? diffDay(year + 1, 12, 24) : diffDay(year, 12, 24)
  const shengdanDay = diffDay(year, 12, 25) < 0 ? diffDay(year + 1, 12, 25) : diffDay(year, 12, 25)
  // 元旦节
  const yuandanDay = diffDay(year, 1, 1) < 0 ? diffDay(year + 1, 1, 1) : diffDay(year, 1, 1)

  // 农历（手动填写）
  // 端午
  const duanwuDay = diffDay(year, 5, 31)
  // 中秋
  const zhongqiuDay = diffDay(year, 10, 6)
  // 重阳
  const chongyangDay = diffDay(year, 10, 29)
  // 腊八
  const labaDay = diffDay(year + 1, 1, 26)
  // 除夕
  const chuxiDay = diffDay(year + 1, 2, 16)

  const festivals = [
    { name: "车贷清", days: carDay, date: '2026.4.24' },
    { name: "招行还款", days: zhaohangDay,  date: diffDay(year, month, 6) < 0 ? `${year}.${month + 1}.6` : `${year}.${month}.6`},
    { name: "光大还款", days: guangdaDay, date: diffDay(year, month, 10) < 0 ? `${year}.${month + 1}.10` : `${year}.${month}.10`},
    { name: "广发还款", days: guangfaDay, date: diffDay(year, month, 24) < 0 ? `${year}.${month + 1}.24` : `${year}.${month}.24`},
    { name: "车贷还款", days: carLoanDay, date: diffDay(year, month, 24) < 0 ? `${year}.${month + 1}.24` : `${year}.${month}.24`},
    { name: "花呗还款", days: alipayDay, date: diffDay(year, month, 25) < 0 ? `${year}.${month + 1}.25` : `${year}.${month}.25`},
    { name: "情人节", days: qingrenDay, date: diffDay(year, 2, 14) < 0 ? `${year + 1}.2.14` : `${year}.2.14`},
    { name: "妇女节", days: funvDay, date: diffDay(year, 3, 8) < 0 ? `${year + 1}.3.8` : `${year}.3.8`},
    { name: "清明节", days: qingmingDay, date: diffDay(year, 4, 4) < 0 ? `${year + 1}.4.4` : `${year}.4.4`},
    { name: "劳动节", days: laodongDay, date: diffDay(year, 5, 1) < 0 ? `${year + 1}.5.1` : `${year}.5.1`},
    { name: "青年节", days: qingnianDay, date: diffDay(year, 5, 4) < 0 ? `${year + 1}.5.4` : `${year}.5.4`},
    { name: "儿童节", days: ertongDay, date: diffDay(year, 6, 1) < 0 ? `${year + 1}.6.1` : `${year}.6.1`},
    { name: "建党节", days: jiandangDay, date: diffDay(year, 7, 1) < 0 ? `${year + 1}.7.1` : `${year}.7.1`},
    { name: "建军节", days: jianjunDay, date: diffDay(year, 8, 1) < 0 ? `${year + 1}.8.1` : `${year}.8.1`},
    { name: "端午节", days: duanwuDay, date: `${year}.5.31`},
    { name: "中秋节", days: zhongqiuDay, date: `${year}.10.6`},
    { name: "国庆节", days: guoqingDay, date: diffDay(year, 10, 1) < 0 ? `${year + 1}.10.1` : `${year}.10.1`},
    { name: "重阳节", days: chongyangDay, date: `${year}.10.29`},
    { name: "平安夜", days: pinganDay, date: diffDay(year, 12, 24) < 0 ? `${year + 1}.12.24` : `${year}.12.24`},
    { name: "圣诞节", days: shengdanDay, date: diffDay(year, 12, 25) < 0 ? `${year + 1}.12.25` : `${year}.12.25`},
    { name: "元旦节", days: yuandanDay, date: diffDay(year, 1, 1) < 0 ? `${year + 1}.1.1` : `${year}.1.1`},
    { name: "腊八", days: labaDay, date: `${year + 1}.1.26` },
    { name: "除夕", days: chuxiDay, date: `${year + 1}.2.16`}
  ]

  const dayRes = formatRes(festivals);
  const dayResStr = `var dayRes = ${JSON.stringify(dayRes, null, 2)}`
  fs.writeFile(filePath, dayResStr, 'utf-8', (err) => {
    if (err) {
      console.log('写入文件时出错：', err)
    } else {
      console.log('数据写入成功')
    }
  })
};

updateCountDayTask();