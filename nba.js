const axios = require("axios");
const fs = require('fs');
const path = require('path');
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
  LiveSchedulesUrl,
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
  const areaHtml = areaData.map((item, i) => {
    const rankColor = i+1 > 8 ? '#2b2d42' : area.startsWith('W') ? '#f8c654' : '#32badd';
    return `<div style="display:flex; flex-wrap:wrap; gap:10px;">
            <div style="flex:1 1 100%; margin-bottom:10px; padding:15px; background:#fff; border:2px solid #edf2f4; border-radius:8px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="width:28px; height:28px; background:${rankColor}; color:#fff; border-radius:50%; 
                    display:flex; align-items:center; justify-content:center; font-weight:700;">${i + 1}</span>
                <img src="${item.image}" 
                  alt="Lakers" 
                  style="width:48px; height:48px; object-fit:contain;">
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
  }).join('');
  return areaHtml
}

const classifyByArea = (data) => {
  const areaMap = {}
  data.forEach(item => {
    const { alias, winningPercentage, localizedName, image, rawName } = item;
    if (!areaMap[alias]) {
      areaMap[alias] = {
        name: alias,
        value: 0,
        children: []
      }
    };
    const rate = Number(winningPercentage);
    const alpha = Math.min(1, rate);
    areaMap[alias].value += rate;
    areaMap[alias].children.push({
      name: localizedName,
      value: Number(winningPercentage),
      path: `${alias}/${localizedName}`,
      image,
      rawName,
      itemStyle: {
        color: `rgba(${alias.startsWith('W') ? `255, 0, 0, ${alpha}` : `0, 123, 255, ${alpha}`})`
      }
    })
  });
  const result = [];
  for (const area in areaMap) {
    const areaData = areaMap[area];
    const childrenCount = areaData.children.length;
    const totalValue = areaData.children.reduce((sum, child) => sum + child.value, 0)
    areaData.value = (totalValue / childrenCount).toFixed(2) * 1;
    result.push({
      ...areaData,
      path: area
    })
  };
  return result;
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
      // 按胜率排序
      return b.winningPercentage - a.winningPercentage
    });
    const filterRes = classifyByArea(result);
    const filePath = path.join(__dirname, 'src', 'resource', 'nbaRes.js')
    const nbaResStr = `var nbaRes = ${JSON.stringify(filterRes, null, 2)}`
    fs.writeFile(filePath, nbaResStr, 'utf-8', (err) => {
      if (err) {
        console.log('写入文件时出错：', err)
      } else {
        console.log('数据写入成功')
      }
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

// 根据日期获取赛程
const getLiveSchedules = (date) => {
  const isToday = dateFormater('YYYY-MM-DD') == date;
  const params = {
    apikey: NbaApiKey,
    version: NbaVersion,
    cm: CM,
    tzoffset: 8,
    activityId: 'DD240170-05CA-42F2-86C2-05F88AF5C24C',
    ocid: 'sports-league-schedule',
    it: IT,
    user: 'm-12394F2DF1F06DD93AF65A8AF02F6C5B',
    scn: SCN,
    date: date,
    ids: NbaId,
    withcalendar: isToday,
    type: 'LeagueSchedule'
  };
  return new Promise((resolve, reject) => {
    axios
      .get(LiveSchedulesUrl, {
        params: params,
      })
      .then((res) => {
        if (res.data) {
          if (res.data.value.length > 0) {
            const schedules = res.data.value[0].schedules
            resolve(schedules);
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

const gameStatus = {
  'PreGame': '未开赛',
  'Final': '已完赛',
  'InProgress': '进行中',
};

const gameColors = {
  'PreGame': '#ff6b00',
  'Final': '#00c8ff',
  'InProgress': '#00ff47',
}

const createScheduleTask = async() => {
  try {
    const Time = dateFormater('YYYY-MM-DD HH:mm:ss', getNowSeconds());
    const today = dateFormater('YYYY-MM-DD')
    const tomorrow = dateFormater('YYYY-MM-DD', new Date(new Date().getTime() +  + 24 * 60 * 60 * 1000))
    const theDayAfterTomorrow = dateFormater('YYYY-MM-DD', new Date(new Date().getTime() +  + 48 * 60 * 60 * 1000))
    const dateList = [today, tomorrow, theDayAfterTomorrow];
    for (const date of dateList) {
      const res = await getLiveSchedules(date);
      const schedules = res[0].games.map(item => {
        return {
          startDateTime: item.startDateTime, // 1741392000000
          venue: {
            name: item.venue.name?.localizedName || item.venue.name?.rawName, // 球馆
            city: item.venue.location.city.name?.localizedName || item.venue.location.city.name?.rawName // 主场城市
          },
          gameState: {
            status: item.gameState.gameStatus, // InProgress,PreGame,Final
            gameClock: item.gameState.gameClock,
            currentPlayingPeriod: item?.currentPlayingPeriod?.number
          },
          homeTeam: item.participants.filter(item => {
            return item.homeAwayStatus == 'Home'
          }).map(team => {
            return {
              name: team.team.name.localizedName, //球队名称
              image: `https://ts4.cn.mm.bing.net/th?id=${team.team.image.id}`,
              score: team.result.score,
              wins: team.team.winLossRecord.wins,
              losses: team.team.winLossRecord.losses
            }
          })[0],
          awayTeam: item.participants.filter(item => {
            return item.homeAwayStatus == 'Away'
          }).map(team => {
            return {
              name: team.team.name.localizedName,
              image: `https://ts4.cn.mm.bing.net/th?id=${team.team.image.id}`,
              score: team.result.score,
              wins: team.team.winLossRecord.wins,
              losses: team.team.winLossRecord.losses
            }
          })[0]
        }
      });
      console.log(date);
      console.log(schedules.length);
      const renderGame = (game) => {
        const status = game.gameState.status;
        return `<div style="display:flex; align-items:center; gap:15px;">
                  <!-- 主队 -->
                  <div style="flex:1; text-align:right;">
                    <img src="${game.homeTeam.image}" 
                         style="width:48px; height:48px; margin-bottom:8px;">
                    <div style="color:#fff; font-weight:700; font-size: 16px;">${game.homeTeam.name}</div>
                    <div style="color:#888; font-size:14px;">主场 ${game.homeTeam.wins}胜-${game.homeTeam.losses}负</div>
                    ${status == 'Final' ? `<div style="color:#00c8ff; font-size:24px; font-weight:800;">${game.homeTeam.score}</div>` : ''}
                    ${status == 'InProgress' ? `<div style="color:#00ff47; font-size:24px; font-weight:800;">${game.homeTeam.score}</div>` : ''}
                  </div>
                  <!-- 比分/时间 -->
                  ${['PreGame', 'Final'].includes(status) ? 
                    `<div style="width:100px; text-align:center;">
                      <div style="color:#ff6b00; font-size:24px; font-weight:800;">VS</div>
                      <div style="color:#aaa; font-size:14px;">${dateFormater('MM-DD', Number(game.startDateTime) + 8 * 60 * 60 * 1000)} ${dateFormater('HH:mm', Number(game.startDateTime) + 8 * 60 * 60 * 1000)}${status == 'Final' ? ' ·完赛' : ''}</div>
                      <div style="color:#888; font-size:12px;">${game.venue.city} ${game.venue.name}</div>
                    </div>` : ''
                  }
                  ${['InProgress'].includes(status) ? 
                    `<div style="width:60px; text-align:center; color:#aaa;">
                      <div style="font-size:12px;">第${game.gameState.currentPlayingPeriod}节 ${game.gameState.gameClock.minutes}:${game.gameState.gameClock.seconds}</div>
                      <div style="font-size:10px;">${game.venue.city} ${game.venue.name}</div>
                    </div>` : ''
                  }
                  <!-- 客队 -->
                  <div style="flex:1; text-align:left;">
                    <img src="${game.awayTeam.image}" 
                         style="width:48px; height:48px; margin-bottom:8px;">
                    <div style="color:#fff; font-weight:700; font-size: 16px;">${game.awayTeam.name}</div>
                    <div style="color:#888; font-size:14px;">客场 ${game.awayTeam.wins}胜-${game.awayTeam.losses}负</div>
                    ${status == 'Final' ? `<div style="color:#00c8ff; font-size:24px; font-weight:800;">${game.awayTeam.score}</div>` : ''}
                    ${status == 'InProgress' ? `<div style="color:#00ff47; font-size:24px; font-weight:800;">${game.awayTeam.score}</div>` : ''}
                  </div>
                </div>`
      };
      const template = `<div style="max-width:600px; margin:0 auto; background:#1e1e1e; border-radius:12px; box-shadow:0 0 20px rgba(255,80,0,0.1);">
        <!-- 标题 -->
        <div style="padding:28px 20px; background:linear-gradient(90deg, #d62424, #ff6b00); border-radius:12px 12px 0 0;">
            <h1 style="margin:0; color:#fff; font-size:34px; text-align:center; font-weight:800; letter-spacing:1px;">
                🏀 NBA赛程速递
            </h1>
        </div>
        <!-- 赛程主体 -->
        <div style="padding:20px 15px;">
          <div style="margin-bottom:15px; padding:10px; background:#edf2f4; border-left:4px solid #ef233c;">
            <h2 style="margin:0; color:#2b2d42; font-size:20px; font-weight:700;">${date}</h2>
          </div>
          ${schedules.map(item => {
            return `<div style="margin-bottom:20px; padding:15px; background:#2a2a2a; border-radius:8px; position:relative; ${['InProgress'].includes(item.gameState.status) ? 'border-left:4px solid #00ff47;' : ''}">
              <div style="position:absolute; top:-8px; right:15px; background:${gameColors[item.gameState.status]}; color:#fff; padding:4px 12px; border-radius:4px; font-size:12px;">
                ${gameStatus[item.gameState.status]}
              </div>
              ${renderGame(item)}
          </div>`
          }).join('')}
        </div>
        <!-- 页脚 -->
        <div style="padding:20px; background:#000; border-radius:0 0 12px 12px; text-align:center;">
          <p style="margin:0; color:#666; font-size:12px; line-height:1.5;">
              © 2025 Tencent NBA 数据更新于 ${Time}<br>
              官方合作伙伴 | 赛事直播请访问腾讯体育
          </p>
        </div>
      </div>`;
  
      sendEmail(
        "hellohehuan@126.com",
        template,
        "【NBA Schedules】By Github Actions"
      );
    };
  } catch (error) {
    console.log(error)
  }
};

const main = async() => {
  await createNBAHtml();
  await createScheduleTask();
}

main()
