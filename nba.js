const axios = require("axios");
const util = require('./util');

const { Day, CopyRight, randomRgbaColor, sendEmail } = util;

const baseUrl = 'https://api.msn.com/sports/standings';
const apiKey = 'kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ';
const version = '1.0';
const cm = 'zh-cn';
const activityId = '3AB4409B-6BFA-43E5-BAFC-DEB35EDBF67C';
const ocId = 'sports-league-standings';
const it = 'edgeid';
const user = 'm-35F7F230E9F8605C12D5E779E8CC6194';
const scn = 'APP_ANON';
const id = 'Basketball_NBA';
const idType = 'league';
const seasonPhase = 'regularSeason';

const getNBAInfo = () => {
  const params = {
    apikey: apiKey,
    version: version,
    cm: cm,
    activityId: activityId,
    ocid: ocId,
    it: it,
    user: user,
    scn: scn,
    id: id,
    idType: idType,
    seasonPhase: seasonPhase
  };
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl, {
        params: params,
      })
      .then((res) => {
        if (res.data) {
          if (res.data.value.length > 0) {
            const standings = res.data.value[0].standings
            resolve(standings);
          }
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createAreaString = (areaData) => {
  let areaString = '';
  areaData.forEach((item, index) => {
    areaString += `<div style="display: flex;align-items: center;margin-bottom: 5px;">
           <div style="color: #ABB3BC;font-size: 24px;width: 30px;text-align: center;">${index + 1}</div>
           <div style="margin: 0 10px;">
             <img style="width: inherit;height: inherit;object-fit: cover;" src="${item.image}" alt="">
           </div>
           <div style="color: #333333; font-weight: 600; font-size: 16px; display: flex; flex-direction: column;">
              <span>${item.shortName}</span>
              <span style="font-size: 14px; color: #ff365c;">${item.winningPercentage}</span>
            </div>
            <div style="flex: 1; text-align: right; color: #124998; font-size: 18px; font-weight: bold;">${item.wins}-${item.losses}</div>
         </div>`
  });
  return areaString;
}

const createNBAHtml = async () => {
  try {
    const res = await getNBAInfo();
    const result = res.map(item => {
      return {
        alias: item.conference.alias,
        wins: item.winLoss.wins,
        losses: item.winLoss.losses,
        winningPercentage: item.winningPercentage,
        shortName: item.team.shortName.localizedName,
        image: `https://ts4.cn.mm.bing.net/th?id=${item.team.image.id}&pid=MSports&w=24&h=24&qlt=90&c=0&rs=1&dpr=2&p=1`
      }
    }).sort((a, b) => {
      return b.wins - a.wins
    });
    const EASTERNS = result.filter(item => {
      return item.alias === 'EASTERN'
    });
    const WESTERNS = result.filter(item => {
      return item.alias === 'WESTERN'
    });

    const html = `<div style="background: linear-gradient(90deg, #124998, transparent);box-shadow: ${randomRgbaColor()} 0px 0px 10px;border-radius: 40px;">
                    <div style="font-weight: bold;color: #fff;text-align: center;padding: 20px;font-size: 20px;">NBA排名</div>
                    <div style="font-weight: bold;color: #fff;padding: 10px 15px;font-size: 16px;">东部分区</div>
                    ${createAreaString(EASTERNS)}
                    <div style="font-weight: bold;color: #fff;padding: 10px 15px;font-size: 16px;">西部分区</div>
                    ${createAreaString(WESTERNS)}
                    ${CopyRight}
                  </div>`;
    sendEmail(
      "hellohehuan@126.com",
      html,
      "【NBA排名】By Github Actions"
    );
  } catch (error) {
    console.error(error);
  }
};

![0, 6].includes(Day) && createNBAHtml();