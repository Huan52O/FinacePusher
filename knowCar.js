const axios = require('axios');
const path = require('path');
const utils = require('./util');
const CONSTANT = require('./constant');

const { KnowCarInfo } = CONSTANT;
const { RankListUrl, OutterDetailTypeMap, TagStyle } = KnowCarInfo;

const {
  sendEmail,
  dateFormater,
  getNowSeconds,
  writeDataToFile
} = utils;

const processResponseData = (res, callback) => {
  if (!res.data) {
    return []
  }
  const result = res.data.data.list;
  console.log(result.length);
  if (result.length === 0) {
    return []
  }
  return result.map(callback)
}

const processItem = (item) => {
  return {
    brandName: item.brand_name,
    rank: item.rank,
    price: item.price,
    image: item.image,
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
}

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
      const list = processResponseData(res, processItem)
      resolve(list)
    }).catch(err => {
      reject(err);
    })
  })
}

const sendRankInfoTask = async () => {
  try {
    const Time = dateFormater('YYYY-MM-DD HH:mm:ss', getNowSeconds());
    const ranks = await getRankList(50);
    console.log(ranks.length);
    const filePath = path.join(__dirname, 'src', 'resource', 'rank.json')
    writeDataToFile(ranks, filePath)
    const template = `<div style="max-width:600px; margin:0 auto; background:#141414; border-radius:16px; box-shadow:0 0 30px rgba(255,80,0,0.1);">
      <!-- 标题 -->
      <div style="padding:28px 20px; background:linear-gradient(90deg, #ff6b00, #ff3c00); border-radius:16px 16px 0 0;">
        <h1 style="margin:0; color:#fff; font-size:36px; text-align:center; font-weight:800; letter-spacing:1px;">
          Car Knowledge Ranking List
        </h1>
      </div>
      <!-- 榜单主体 -->
      <div style="padding:15px;">
        ${ranks.map(item => {
          return `<div style="margin-bottom:15px; background:#1e1e1e; border-radius:12px; display:flex; gap:15px; align-items:center;">
            <!-- 排名 -->
            <div style="width:30px; height:30px; background:#ff6b00; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:#fff;">
              ${item.rank}
            </div>
            <img src="${item.image}" style="width:90px; object-fit:contain; border-radius:8px;">
            <!-- 车型信息 -->
            <div style="flex:1;">
              <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:8px;">
                <div style="color:#fff; font-size:16px; font-weight:700;">${item.brandName} ${item.seriesName}</div>
                <div style="color:#888; font-size:14px;">${OutterDetailTypeMap[item.outterDetailType]}</div>
              </div>
              <!-- 价格与标签 -->
              <div style="display:flex; gap:15px; margin-bottom:12px;">
                <div style="color:#ff6b00; font-size:14px; font-weight:700;">${item.price}</div>
                <div style="display:flex; gap:6px;">
                  ${item.tagList.map((tag, i) => {
                    return `<span style="padding:4px; background:${TagStyle[i].background}; color:${TagStyle[i].color}; border-radius:4px; border:1px solid ${TagStyle[i].border}; font-size:12px;">${tag.tagName}(${tag.count})</span>`
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

const processAttentionItem = (item) => {
  return {
    brandName: item.brand_name,
    seriesName: item.series_name,
    subBrandName: item.sub_brand_name,
    price: item.dealer_price,
    image: item.image,
    rank: item.rank,
    count: item.count
  }
}

const getAttentionList = (type, count) => {
  const params = {
    aid: '1839',
    app_name: 'auto_web_pc',
    city_name: '广州',
    count: count,
    offset: 0,
    month: '',
    new_energy_type: '',
    rank_data_type: '1',
    brand_id: '',
    price: '',
    manufacturer: '',
    outter_detail_type: type,
    nation: '0'
  }
  return new Promise((resolve, reject) => {
    axios.get(RankListUrl, {
      params
    }).then(res => {
      const list = processResponseData(res, processAttentionItem)
      resolve(list)
    }).catch(err => {
      reject(err)
    })
  })
}

const sendAttentionInfoTask = async (type) => {
  try {
    const Time = dateFormater('YYYY-MM-DD HH:mm:ss', getNowSeconds());
    const AttentionMap = {
      'sedan': {
        'type': '0,1,2,3,4,5',
        'flag': 'Sedan',
        'title': '轿车'
      },
      'suv': {
        'type': '10,11,12,13,14',
        'flag': 'Suv',
        'title': 'SUV'
      }
    }
    const attention = AttentionMap[type]
    const ranks = await getAttentionList(attention['type'], 50);
    const filePath = path.join(__dirname, 'src', 'resource', `${type}.json`)
    writeDataToFile(ranks, filePath)
    console.log(ranks.length);
    const template = `<div style="max-width:600px; margin:0 auto; background:#141414; border-radius:16px; box-shadow:0 0 30px rgba(255,80,0,0.1);">
      <!-- 标题 -->
      <div style="padding:28px 20px; background:linear-gradient(90deg, #00e1ff, #0080ff); border-radius:16px 16px 0 0;">
        <h1 style="margin:0; color:#fff; font-size:36px; text-align:center; font-weight:800; letter-spacing:1px;">
          ${attention['flag']} Attention List
        </h1>
      </div>
      <!-- 榜单主体 -->
      <div style="padding:15px;">
        ${ranks.map(item => {
          return `<div style="margin-bottom:15px; background:#1e1e1e; border-radius:12px; display:flex; gap:15px; align-items:center;">
            <!-- 排名 -->
            <div style="width:30px; height:30px; background:#00fff2; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:#fff;">
              ${item.rank}
            </div>
            <img src="${item.image}" style="width:90px; object-fit:contain; border-radius:8px;">
            <!-- 车型信息 -->
            <div style="flex:1;">
              <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:8px;">
                <div style="color:#fff; font-size:16px; font-weight:700;">${item.brandName} ${item.seriesName}</div>
                <div style="color:#888; font-size:14px;">${item.subBrandName}</div>
              </div>
              <!-- 价格与标签 -->
              <div style="display:flex; gap:15px; margin-bottom:12px; justify-content: space-between; align-items: center;">
                <div style="color:#00fff2; font-size:14px; font-weight:700;">${item.price}</div>
                <div style="padding:4px; background:#0095ff20; color:#0095ff; border-radius:4px; border:1px solid #0095ff50; font-size:12px;">${item.count}</div>
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
      `【${attention['title']}关注度榜】By Github Actions`
    );
  } catch (error) {
    console.log(error)
  }
}

const main = async () => {
  await sendRankInfoTask();
  await sendAttentionInfoTask('sedan');
  await sendAttentionInfoTask('suv');
}

main()