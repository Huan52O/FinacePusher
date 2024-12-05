const axios = require("axios");
const util = require('./util');
const CONSTANT = require('./constant');

const {
  Day, 
  CopyRight, 
  CM,
  IT,
  SCN,
  FinaceInfo
} = CONSTANT;

const {
  FinaceUrl,
  FinaceApiKey,
  FinaceActivityId,
  FinaceOcId,
  FinaceIds,
  FinaceWrapodata,
} = FinaceInfo;

const { 
  randomRgbaColor, 
  sendEmail 
} = util;

const getFinaceInfo = () => {
  const params = {
    apikey: FinaceApiKey,
    activityId: FinaceActivityId,
    ocid: FinaceOcId,
    cm: CM,
    it: IT,
    scn: SCN,
    ids: FinaceIds.join(","),
    wrapodata: FinaceWrapodata,
  };
  return new Promise((resolve, reject) => {
    axios
      .get(FinaceUrl, {
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