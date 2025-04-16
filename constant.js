const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

const Day = dayjs().tz('Asia/Shanghai').day();
const Time = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');

const CM = 'zh-cn';
const IT = 'edgeid';
const SCN = 'APP_ANON';
const CopyRight = `<p style="margin: 0;padding: 0; text-align:center; color: #ee55aa;font-size:15px; line-height: 80px;">copyright© Dearhuan 2020 All Right Reserved</p>`;

const FinaceInfo = {
  FinaceUrl: 'https://assets.msn.cn/service/Finance/Quotes',
  FinaceApiKey: '0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM',
  FinaceActivityId: 'ADDBC96E-7D9D-4DFE-BAAE-7EE57AD8BAE2',
  FinaceOcId: 'finace-utils-peregrine',
  FinaceIds: [
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
],
  FinaceWrapodata: false,
};

const NbaInfo = {
  NbaUrl: 'https://api.msn.com/sports/standings',
  LiveSchedulesUrl: 'https://api.msn.com/sports/liveschedules',
  NbaApiKey: 'kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ',
  NbaVersion: '1.0',
  NbaActivityId: '3AB4409B-6BFA-43E5-BAFC-DEB35EDBF67C',
  NbaOcId: 'sports-league-standings',
  NbaUser: 'm-35F7F230E9F8605C12D5E779E8CC6194',
  NbaId: 'Basketball_NBA',
  NbaIdType: 'league',
  NbaSeasonPhase: 'regularSeason'
};

const OilInfo = {
  OilUrl: 'http://apis.juhe.cn/gnyj/query',
  OilKey: 'b8757c3851968e979f533f27fc7969c7',
  OilCity: '广东',
  OilMapping: {
    '92h': { name: '92#汽油', color: '#4facfe' },
    '95h': { name: '95#汽油', color: '#00f2fe' },
    '98h': { name: '98#汽油', color: '#7b61ff' },
    '0h': { name: '0#柴油', color: '#00e676' }
  }
};

const KnowCarInfo = {
  RankListUrl: 'https://www.dongchedi.com/motor/pc/car/rank_data',
  OutterDetailTypeMap: {
    '0': '微型轿车',
    '1': '小型轿车',
    '2': '紧凑型轿车',
    '3': '中型轿车',
    '4': '中大型轿车',
    '5': '大型轿车',
    '10': '小型SUV',
    '11': '紧凑型SUV',
    '12': '中型SUV',
    '13': '中大型SUV',
    '14': '大型SUV',
  },
  TagStyle: [
    {
      background: '#ff6b0020',
      color: '#ff6b00',
      border: '#ff6b0050'
    },
    {
      background: '#00ff4720',
      color: '#00ff47',
      border: '#00ff4750'
    },
    {
      background: '#0095ff20',
      color: '#0095ff',
      border: '#0095ff50'
    },
  ]
};

const FundURL = "http://fundgz.1234567.com.cn/js/";

module.exports = {
  Day,
  Time,
  CM,
  IT,
  SCN,
  CopyRight,
  FinaceInfo,
  NbaInfo,
  OilInfo,
  KnowCarInfo,
  FundURL
}