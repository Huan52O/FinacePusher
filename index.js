const axios = require("axios");
const util = require('./util');

const { Day, CopyRight, randomRgbaColor, sendEmail } = util;

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
    console.log(finaceList[0]);

    let trendStr = "";
    if (finaceList.length > 0) {
      finaceList.forEach((ele) => {
        trendStr += `<div style="display:flex;justify-content:space-between;align-items:center;">
                <p style="width:330px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><span style="margin:0 15px;font-size:16px;font-weight:700;color:#f26d5f">${
                  ele[0].symbol
                }</span><a style="color:#00c3ff;text-decoration: none;">${
          ele[0].localizedAttributes["zh-cn"].shortName || ele[0].localizedAttributes['zh-cn'].displayName || '-'
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
                    font-size: 20px;">Finace Notice</div>
                    ${trendStr}
                    ${CopyRight}
                  </div>`;
    sendEmail(
      "hellohehuan@126.com",
      html,
      "【Finace Notice】By Github Actions"
    );
  } catch (error) {
    console.error(error);
  }
};

![0, 6].includes(Day) && createFinaceHtml();