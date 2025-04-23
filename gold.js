const axios = require('axios');
const utils = require('./util');

const { dateFormater } = utils

const getData = () => {
  const params = {
    np: 1,
    fltt: 1,
    invt: 2,
    cb: `jQuery37105876305693407142_${new Date().getTime()}`,
    fs: 'm:113+t:5',
    fields: 'f12,f13,f14,f1,f2,f4,f3,f152,f17,f28,f15,f16,f5,f211,f212,f108',
    fid: 'f3',
    pn: 1,
    pz: 5,
    po: 1,
    ut: 'fa5fd1943c7b386f172d6893dbfba10b',
    dect: 1,
    wbp2u: '|0|0|0|web',
    _: `${new Date().getTime()}`
  };
  return new Promise((resolve, reject) => {
    axios.get('https://push2.eastmoney.com/api/qt/clist/get', { params })
      .then(res => {
        res.data ? resolve(res.data) : resolve([])
      })
      .catch(err => {
        console.log(err);
      })
  })
};

const main = async () => {
  const res = await getData();
  console.log(res);
};

main()