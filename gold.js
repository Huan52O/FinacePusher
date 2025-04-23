const axios = require("axios");
const utils = require("./util");

const { dateFormater } = utils;

const keyMap = {
  f12: '代码',
  f14: '名称',
  f17: '今开',
  f15: '最高',
  f16: '最低',
  f28: '昨结',
  f124: '更新时间'
}

const getData = () => {
  const params = {
    np: 1,
    fltt: 1,
    invt: 2,
    cb: `jQuery37107208853041718065_${new Date().getTime()}`,
    fs: "m:118",
    fields: "f12,f13,f14,f1,f2,f4,f3,f152,f17,f28,f15,f16,f124",
    fid: "f3",
    pn: 1,
    pz: 5,
    po: 1,
    ut: "fa5fd1943c7b386f172d6893dbfba10b",
    dect: 1,
    wbp2u: "|0|0|0|web",
    _: `${new Date().getTime()}`,
  };
  return new Promise((resolve, reject) => {
    axios
      .get("https://push2.eastmoney.com/api/qt/clist/get", { params })
      .then((res) => {
        res.data ? resolve(res.data) : resolve([]);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const main = async () => {
  const res = await getData();
  console.log(res);
  const data = JSON.parse(res.substring(res.indexOf("(") + 1, res.lastIndexOf(")")));
  console.log(data);
};

main();
