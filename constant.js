const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

const Day = dayjs().day();

const CM = 'zh-cn';
const IT = 'edgeid';
const SCN = 'APP_ANON';
const CopyRight = `<p style="margin: 0;padding: 0; text-align:center; color: #ee55aa;font-size:15px; line-height: 80px;">copyright© Dearhuan 2020 All Right Reserved</p>`;

const FinaceInfo = {
  FinaceUrl: 'https://assets.msn.cn/service/Finance/Quotes',
  FinaceApiKey: '0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM',
  FinaceActivityId: '3A9B5B12-B975-4D8D-88AA-AA76DC86601B',
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
  OilCity: '广东'
}

module.exports = {
  Day,
  CM,
  IT,
  SCN,
  CopyRight,
  FinaceInfo,
  NbaInfo,
  OilInfo
}