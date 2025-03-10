const axios = require('axios');
const utils = require('./util');
const CONSTANT = require('./constant');

const { KnowCarInfo } = CONSTANT;
const { RankListUrl, OutterDetailTypeMap, TagStyle } = KnowCarInfo;

const {
  sendEmail,
  dateFormater,
  getNowSeconds
} = utils;

const getRankList = (count) => {
  const params = {
    aid: '1839',
    app_name: 'auto_web_pc',
    city_name: '广州',
    count: count,
    offset: 0,
    month: '',
    new_energy_type: '',
    rank_data_type: '58',
    brand_id: '',
    price: '',
    manufacturer: '',
    series_type: '',
    nation: '0'
  }
  return new Promise((resolve, reject) => {
    axios.get(RankListUrl, {
      params: params
    }).then(res => {
      if (res.data) {
        const result = res.data.data.list;
        if (result.length > 0) {
          const list = result.map(item => {
            return {
              brandName: item.brand_name,
              rank: item.rank,
              price: item.price,
              seriesName: item.series_name,
              score: item.score,
              outterDetailType: item.outter_detail_type,
              tagList: item.review_tag_list.map(tag => {
                return {
                  tagName: tag.tag_name,
                  count: tag.count
                }
              })
            }
          })
          resolve(list)
        }
      } else {
        resolve([])
      }
    })
  })
}

const sendRankInfoTask = async () => {
  try {
    const Time = dateFormater('YYYY-MM-DD HH:mm:ss', getNowSeconds());
    const ranks = await getRankList(50);
    const template = `<div style="max-width:600px; margin:0 auto; background:#141414; border-radius:16px; box-shadow:0 0 30px rgba(255,80,0,0.1);">
      <!-- 标题 -->
      <div style="padding:28px 20px; background:linear-gradient(90deg, #ff6b00, #ff3c00); border-radius:16px 16px 0 0;">
        <h1 style="margin:0; color:#fff; font-size:36px; text-align:center; font-weight:800; letter-spacing:1px;">
          🚗 懂车分榜
        </h1>
      </div>
      <!-- 榜单主体 -->
      <div style="padding:15px;">
        ${ranks.map(item => {
          return `<div style="margin-bottom:20px; padding:15px; background:#1e1e1e; border-radius:12px; display:flex; gap:15px; align-items:center; border-left:4px solid #ff6b00;">
            <!-- 排名 -->
            <div style="width:30px; height:30px; background:#ff6b00; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:#fff;">
              ${item.rank}
            </div>
            <!-- 车型信息 -->
            <div style="flex:1;">
              <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:8px;">
                <div style="color:#fff; font-size:20px; font-weight:700;">${item.brandName} ${item.seriesName}</div>
                <div style="color:#888; font-size:14px;">${OutterDetailTypeMap[item.outterDetailType]}</div>
              </div>
              <!-- 价格与标签 -->
              <div style="display:flex; gap:15px; margin-bottom:12px;">
                <div style="color:#ff6b00; font-size:16px; font-weight:700;">${item.price}</div>
                <div style="display:flex; gap:6px;">
                  ${item.tagList.map((tag, i) => {
                    return `<span style="padding:4px 4px; background:${TagStyle[i].background}; color:${TagStyle[i].color}; border-radius:4px; border:1px solid ${TagStyle[i].border}; font-size:12px;">${tag.tagName}(${tag.count})</span>`
                  }).join('')}
                </div>
              </div>
              <!-- 评分条 -->
              <div style="background:#2a2a2a; height:8px; border-radius:4px; position:relative;">
                <div style="width:${Number(item.score) / 10 * 2}%; height:100%; background:linear-gradient(90deg, #ff6b00, #ff3c00); border-radius:4px;"></div>
                <div style="position:absolute; right:0; top:-24px; color:#ff6b00; font-size:18px; font-weight:700;">${Number(item.score) / 100 * 2}</div>
              </div>
            </div>
          </div>`
        }).join('')}
      </div>
      <!-- 页脚 -->
      <div style="padding:25px; background:#000; border-radius:0 0 16px 16px; text-align:center;">
        <p style="margin:0; color:#666; font-size:12px; line-height:1.5;">
          📊 数据更新：${Time}<br>
          © 2025 懂车帝AutoRating 专业汽车评测平台
        </p>
      </div>
    </div>`;
    sendEmail(
      "hellohehuan@126.com",
      template,
      "【懂车分榜】By Github Actions"
    );
  } catch (error) {
    console.log(error)
  }
}

const main = async () => {
  await sendRankInfoTask()
}

main()