const axios = require('axios');
const CONSTANT = require('./constant')

const { FundURL } = CONSTANT

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
    code: '005918',
    name: 'tianhong',
    area: 'hushen'
  },
  {
    code: '161725',
    name: 'zhaoshang',
    area: 'baijiu'
  },
  {
    code: '005827',
    name: 'lanchou',
    area: 'baijiu'
  },
  {
    code: '003096',
    name: 'zhongou',
    area: 'yiliao'
  },
  {
    code: '161726',
    name: 'guozheng',
    area: 'yiliao'
  },
  {
    code: '003984',
    name: 'jiashi',
    area: 'energe'
  },
];

const task = async () => {
  const arr = [];
  for (const item of list) {
    const code = item.code;
    try {
      const res = await getFundInfo(code); 
      const data = JSON.parse(res.substring(res.indexOf("(") + 1, res.lastIndexOf(")")));
      data.area = item.area;
      arr.push(data);
    } catch (error) {
      console.error(`获取 ${code} 信息时出错:`, error);
    }
  };
  console.log(arr);
}

task()