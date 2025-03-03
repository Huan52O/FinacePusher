const axios = require("axios");
const util = require('./util');
const CONSTANT = require('./constant');

const {
  Day, 
  CM,
  IT,
  SCN,
  NbaInfo
} = CONSTANT;

const {
  NbaUrl,
  NbaApiKey,
  NbaActivityId,
  NbaVersion,
  NbaOcId,
  NbaUser,
  NbaId,
  NbaIdType,
  NbaSeasonPhase,
} = NbaInfo;

const { 
  sendEmail,
  dateFormater,
  getNowSeconds
} = util;

const getNBAInfo = () => {
  const params = {
    apikey: NbaApiKey,
    version: NbaVersion,
    cm: CM,
    activityId: NbaActivityId,
    ocid: NbaOcId,
    it: IT,
    user: NbaUser,
    scn: SCN,
    id: NbaId,
    idType: NbaIdType,
    seasonPhase: NbaSeasonPhase
  };
  return new Promise((resolve, reject) => {
    axios
      .get(NbaUrl, {
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

const renderArea = (areaData, area) => {
  const area = areaData.map((item, i) => {
    const rankColor = i+1 > 8 ? '#2b2d42' : area.startsWith('W') ? '#f8c654' : '#32badd';
    return `<div style="display:flex; flex-wrap:wrap; gap:10px;">
            <div style="flex:1 1 100%; margin-bottom:10px; padding:15px; background:#fff; border:2px solid #edf2f4; border-radius:8px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="width:28px; height:28px; background:${rankColor}; color:#fff; border-radius:50%; 
                    display:flex; align-items:center; justify-content:center; font-weight:700;">${i + 1}</span>
                <img src="${item.image}" 
                  alt="Lakers" 
                  style="width:40px; height:40px; object-fit:contain;">
                <div style="flex:1;">
                  <div style="font-weight:700; color:#2b2d42;">${item.rawName}</div>
                  <div style="font-weight:700; color:#2b2d42;">${item.localizedName}</div>
                  <div style="display:flex; gap:15px; margin-top:5px;">
                    <span style="color:#8d99ae;">${item.wins}-${item.losses}</span>
                    <span style="color:#ef233c; font-weight:700;">${item.winningPercentage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>`
  })
  return area
}

const createNBAHtml = async () => {
  try {
    const Time = dateFormater('YYYY-MM-DD HH:mm:ss', getNowSeconds());
    const res = await getNBAInfo();
    const result = res.map(item => {
      return {
        alias: item.conference.alias,
        wins: item.winLoss.wins,
        losses: item.winLoss.losses,
        winningPercentage: item.winningPercentage,
        shortName: item.team.shortName.localizedName, // 中文缩写
        localizedName: item.team.name.localizedName, // 中文全称
        rawName: item.team.name.rawName, // 英文全称
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

    const html = `
    <div style="background:#f5f5f5; font-family: 'Arial Narrow', sans-serif; max-width:600px; margin:0 auto; background:#ffffff; box-shadow:0 2px 15px rgba(0,0,0,0.1);">
      <!-- 标题 -->
      <div style="padding:25px; background:linear-gradient(135deg, #2b2d42, #1a1b2f); text-align:center; border-bottom:3px solid #ef233c;">
          <h1 style="margin:0; color:#fff; font-size:36px; font-weight:800; letter-spacing:2px; text-transform:uppercase;">
              🏀 NBA 2024 STANDINGS
          </h1>
      </div>
      <!-- 西部联盟 -->
      <div style="padding:20px 15px 10px;">
          <div style="margin-bottom:15px; padding:10px; background:#edf2f4; border-left:4px solid #ef233c;">
              <h2 style="margin:0; color:#2b2d42; font-size:20px; font-weight:700;">WESTERN CONFERENCE</h2>
          </div>
          ${renderArea(WESTERNS, 'W')}
      </div>
      <!-- 东部联盟 -->
      <div style="padding:10px 15px 20px;">
          <div style="margin-bottom:15px; padding:10px; background:#edf2f4; border-left:4px solid #0066cc;">
              <h2 style="margin:0; color:#2b2d42; font-size:20px; font-weight:700;">EASTERN CONFERENCE</h2>
          </div>
          ${renderArea(EASTERNS, 'E')}
      </div>
      <!-- 页脚 -->
      <div style="padding:20px; background:#2b2d42; text-align:center;">
          <p style="margin:0; color:#edf2f4; font-size:12px; line-height:1.5;">
              © 2024 NBA Official Partner<br>
              Updated: ${Time}
          </p>
      </div>
    </div>`;
    sendEmail(
      "hellohehuan@126.com",
      html,
      "【NBA Standings】By Github Actions"
    );
  } catch (error) {
    console.error(error);
  }
};

![0, 6].includes(Day) && createNBAHtml();