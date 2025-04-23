const axios = require("axios");
const fs = require('fs');
const path = require('path');
const utils = require('./util');

const filePath = path.join(__dirname, 'src', 'resource', 'actualGolds.js');

const { getRandomColor, dateFormater } = utils;
const Time = dateFormater('YYYY-MM-DD hh:mm:ss')

const keyMap = {
  f12: '代码',
  f14: '名称',
  f17: '今开',
  f15: '最高',
  f16: '最低',
  f28: '昨结',
  f124: '更新时间'
}

const icons = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABghJREFUWEfFlmlwFFUQx/9v3s5uEkIgIRgwoBwhYDIzSwKVD5RBDqsUOQqRAtFSwNJCKeUqUAICIldECvECueQKUFwFgnzghpBgiGDIzCZIICiXwZAlkGuzszPzrN1Ujj1CQqSK+TY13f3/db/unkfwlB/ylPXRJIAkSZMZY8MoRSwBohjDDYORi4yxI4qi7Pi/CTQKIAjCT4SQSeGhqGzXhpHYzkZIcrSGs3dMkK9zzn/uEZ4QaLqBRYqiLG4pSEAAURRL2oSy0G9TelsS+74IdHgfuLkYOLIVSOTrtH7JpFi0heqazpRc2ZbQEgg/AEmStDEDNTp37nwgYihwbydQcgCoLgT+cHkB1AqOX0KRd4MzLubY6ONCeAEIgrAvKhwjjx/eyIGpwK1UwHGtPuZdHegQWOOVGQTFZab9l3Jtox4Hog5AkqSZjLHl8sERBGBAyT6/OENn887DqS5LIIEMmWDyKh6EkFmyLK9oLkQdQEJvqbK/1QhZNYUCRrWf/+gFvPPaHWLERDNu78LAEOt2PMCmjMjqrN/zgh8LYMCAAUF2u92xJUVFQg9/13eWUFUu5CArNoskCk6pu4Ftc3Wzr+XVy/cxdmUU2rSNDD59+rR/FgGoPBWQJGkcIUbapQ0uztfm3aUmLbeQY0FBwUJ2dnZBUlJSbHW1w2btbpCtczSTl73LiUEzg5i9wvy2LMs7m1MFD4DVal0bGaZPPL7CxcPdaM/WNNqEZZTlXKOaYbDXbTbb4dqAgiAM5TiyPyFGN21O0WuOMV8DegJTVmos/Urb9bm5uZOaDSAIwqEXnidDdo93UJQzoBuHs9dNmPaDSXdpOKcoSn/fYKIopvMm9Fv1sUaTJQO4pAHRLnx1QEPauYhfbTbb8GYDiKL4abAFS86vUb1KmnONwwdfm3TVhVxFUfrUBhRF8aKZh3X9LI0mxBj1OuV2jF4WwQruWjYA2K4oypmmIDzlc5+rw+G4cmyFiqgIb5eCW8Bbi81uiAJFUeJEUcw384jd8blKYzt72z64WYQBC58DpZyu64wzGGCiuKcbZKEsy6sDwdSNoVUS1YlDdH7qaN3PrshOMHwO74Fwix9a6qId2zFvu6oynMisxMKDnZC+QgeIgaJyit2nOGw7RnWzCWd+y1YG+wavAxBFMc1swrgL61S/SXA7lVUBg6ab9ZPfqDQsJEAuRYUYlNoDSfEEqa+5AI0BXeq35sBpPOxlBIqieG1fr5c+ieJVsases2m2fxU8khUGEBqAr7QI0zeG43ZZKPZ8qTV67MNm87h9jxTnykpUrZEXQO1C2j3fiV5dAvwoZQ2QGvSprgEP7uKcjeDDLV1xYZ0KswmYmFqTuW8i98uBEbMpe1jFbbbZbO+5bfxUrFbrqGDetSe5V7WxfCrvvWiyXUASD2gq4KwCHvyL7453xNbMdlgwQcfwfoZHPOcqdbmDJ/TQeV+IpT+rOCFbSk5m/tk+IEBtaQb166W0DjbiRyaU4plwRjp1NEHiCQqdZbhVQnH2ahgu3QgBtfDY/UVN2WvFNd14w/1uotw+X4jTWdVI2dKKZV3I95zlI69k7v0AYHSIxejFGFo5VI4LtRgaCCurdNLwJRNdZFgXHejEeYnn5eUdcgePj48f7gXxtw5EVCM5JQwPHfQlRVHSm7wTBuooURT7U46dylnt5FCMxwMIq0DyvIj/B+CGkkRBP77SxbVvW4/YnCPIOl+K6ZsjjawL+Z5ObVEFPNuzr1g8Y4zWfuzABqu4QR8EbELDwLpd5dh+LqI4PSvfM4otBuiTKKQFmcmbGd+rfne0xsaw4k4Rhi6LZvcraeNj2NTPo+H3xAThfkw0wnct8Ezdox9HBeZtIDia18aefTEvMuAiaipGIw3JukWpOLCswdfbRv0qZgwoL8Una0Jw5krYo1dxSwDcPiNf7nkl2KTFfvRqGYSeQQhvZQHUKtjLncjKAzadCQch3F97jxZ089VocQ/4BkpMFNdGtNLGVji4sNAgA04XIU6NsMjWepVTIz+eyLj8WaAEnxhAw+BxcXGDKaVasy8kLS39k/D7D7pLqj+U4bbHAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAYhJREFUWEfNlUFKw0AUht+MZqGggoumIlgvoAvRkeJGZFrxCnoCPYlLV3oC3XgDHaQbCY0iqBewgpiIiCgY0DqREQJFks68tGOabf6Z9+Wf+QiBgh9S8HwYfICXi9pK1P6OpqtnVzba0jbw7Nf2JMRBiYndfwV48NYWnCFaB4B1NZgCuaYEjieXTs/7CZLZQOEAyVf2cgSPHl8lQKNy9aSZ1Zr2DuS9hIFXXyZUbqjBUkJjqioaaRBagL+LPl+bgTPB3LTN2lHr3RmdHVfvrAAEl3yOSrjpdgklhfnyorhVmb4cQeew0OfbBGC/G0AMsOMycWBqCuoIQp8fEoBNDcCRy8SWLYAWAZjRANy7TFSsADz5PDbZuMSEcbPGQZPBeTKZAKa6JUOx+WRdKgBWN2y+s6lUAKxu2LwJAEq3XvTMagClW+hzVF7bAFY3bF4LkEenvGt+j+Dr4+5teKQypvvD2cgSjEI2sgSjkI2sAjBWzkZWARgrZCNLMArZyA7u3zCv19h1hTfwA1NYGyD5h6UdAAAAAElFTkSuQmCC',
  'data:image/png;base64,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',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA45JREFUWEftVk1oXFUU/s679/10MklsMxNF1FTBhS7EhTXNtB0mLS4UioggIpSISLoULF1X3Ll160IRV27SZhqQGkjoQlpB3AgupItApVobJxPpzHtzf47cN5lh8jqTmdpKNzmzeD/33HO+73znnjeER2z0iPNjH8B+BR5qBRrfz79NjNdAuMqSr+bm128Oa/IHBsBrlaipxFkiXmTgxd6ETPRrcODApn/s8olBQP4zgPqV8vM+yUUAZwGM9yYgz4OMQogoBJEHmyQfibnq5/1A3DeA5uqpeYAXmfFuNqAnJUQYpsl7zSq9IWYvHn4gAM0rJ88wpWyPZQMJ30/ZiiAYKLluNE/6x1fWsg57VmB79dSUD7vITC7xTHZzWuYwhGM+zIxS1+XspaMjA9hcKv/oB94RERDcr2NO306Z3f2oxsxo1rZO54RZpfn1uBuvX4DaUuXlRNmfAU6XpU+QUmBsagwyikbNmfqZloJJ4vTqzJPCxbgj56pF99xXAsdeKT6SzTQ1MwXpDy+326fjBCaOYY1Jw4jAhwij9Lqz/qlfql7YBeD2WiWfV94n/2zpc7zDvhfE5PQ4ooncwAqwZZg4gU5isLXtxDunItsnVus/xasXn+gC+Hu5sh4ENKtaNkri9uas5SZCjE8/ds97x9Kx1Y0E8ADyKGXrmnSvPjFx850UwJ1LlQWdmK/cvS8J8AiuaYxmcLsNUvNDgUNPF7rPRqk0ca++KeMwGiDubuxWq1/aAJbKG1rxM73LniAUn51Gs34XrUYLKlapKO6dSVrQTl+t++o7UKPMglHqBm1friw0Gm32WSscLkBIgeRuE1u3tiEkIQgFiNonY5C+ewFgtmyUuSZhP6aj1Wv011J5w2TYdwJ0mq52cxOtuM22Yw7IwR45hrG2xiRkzfIft39//8nTPzU6/lSrli9oTW/B2BeMxa5ZmhuPEORDbN2q3xPf8wjF56aH5QVrvWm0+tIvrZzv57zrGNar5TeUoQ/Z8nGjuRhEIh0VWfadQIWZKYgBc8EqdYMtfybnlr/YC+XAb8Fv37w+8fjB5tdK8Uta2aeY0Z4gPTZZzCOaHOu+cWfGtFrXYe05v7Tyw9DyDJqE/TbWVk68aRR9YBklq7ngjkRnLrA1idWmKiQv0CvVrr4PFUBvsPp3c4dM7J8nT76XL4x965eqffX93wCMEnhUn/v+RzRq4FH99gHsV+BfxCVka8gqJGIAAAAASUVORK5CYII=',
  'data:image/png;base64,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',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAgCAYAAACLmoEDAAAAAXNSR0IArs4c6QAABu5JREFUWEe1l3+MXFUVx7/nvpnWnZlSq0ZCSNVgkDZCQBpTCFhAIHHn7bYBtq5u5w1tlk5rQNE2QSv4BxHRikZNDQIl2J033W53F+l2582yDdpNi6klxBCwaTBFYyoVoiHYnTfD7rx3v+6bbre7szs/dov3z/e+53s/795zzz1PsMBRcKzVGviyEK0UfNxQ3NLUnBlZoF1DYdKQCsBozrpFadwiStaQvH1WHJFXIluazHR3o57z1TUEG6xixLSP5x1rpwAP1ZqEkIdiZvqJ+YI0om8QNtmtQRUz7a+NDibblWJPTWDil7EW+zuNAMxHUxe26CTv0+DuwFSAv2nNu0NhuL4vfwCwvNpkhPTGzHT76GCyTSlu0MT3l7TYJ+cDV6mtCXt2IHGVCkm/AFfPCNRIRVvt3W428TuI3FUVgHiZvtcGI3yNCJ8n5VuxlnTXQoFrwrrZ5C4IH5jTXLA7GrdTbtZ6GILHqgEEu0GRNpAGgD6AuaiZuX8hwFVhC1lrPQW9dUyPl+h3hFXoKpC5qsCCD6jZ5vl4M2TIfgj0e+4Ha5Z/ta84H+iaKzs2vHGF5/kB8DU1TF0R6dSl0ogKhf5I4LNVtYKU73svKBXaJ8AdilzT1JI52ihw3QMWGOWdZLeAX69pSnk82pJ+OO9YPQK0z6UVwcskX4pE/vmjQmF5P4B1AmyLmPYvGgGunga5e28idLOQTREzs73oWDs08HhNU5GDvl/qVGJsFJEnBBjVYNaADGmDL0W/kvnXaNZaCbLdMEIvkv6xwI/gvpiZ6agHPAO2OLTxM5r+owDuBHHZ+eBgRSJx+0tuzmoFy3n8kRoV4O+k3kyIv6Q1M5J3Oq4zEP6Cpr5RBBsIRIJYQ/uf85WRBPDIpNdb4/BvX2Z2/6PGYb3wqjBkrY802315x+qaOMWB0fRRgsEbSp5+P6yMHhBfrJ6bcsjNF++JRhePALJqTh35QiQsVsHj64BcMbUwYFvEzDw/Zxqdf+gOJVLQ8jQnbx83a3VC8OzsINkaNdNPu07yOYCb5jaVXoi/nVSna22tgOXcJmT/dJ0AP4mY9o7K2HIa/PfFzo+F9PgREJ8vC4hXlGG0j3vj4ZAyDgO4fEag4Llo3O4sOMltBH8+C0jwjNbYpQRv1IbFW02R0ysKxeUDE3PGJ+c+JcCAVupQLN51qOIjgHzW+pkItlcY+wJlRcyufQXH2ktgxgEgcULTu3WRseh6j3q/AB+dluM/9TwMGgbqliWSOwnJKCAFzT3RtZk/Bz5uNpGCyI1R057aPXGzHatEjOMEghtm9qD8OtqS/qbrJLcAfKpSQLBZafUGhT0Q3By8V8AODfkLwME6aXAk6CEiEuqV+G//fQ4Qqel57iuuuKQ582bgI65jBfXunlqmEBwzFJMlT8JKEDTYn6zQ/yBq2o+5jvUbAFtBbiFYEFH27LyTIxo8oLT0RlrTb88FWBGz5/zqSt5JPCiQ7wIXSlUV8DFqpmKtmXQhZ/VOpMH6GTryYLQls851rPs1+A40LlNKdpWPAPl7JWpYlOobF+OsoceaY/HMXtdJHAPkhpoLNVHbPC2rl7amXykfsHP1MwDmTfUCCflVzEx/u5BLPECeg5ka5JkQ5I5x8lKl5GaBjHrAEI3wfwJAaGmGoFmApRM7ESo4yb8SvLLenCLYG4nbialLIbhZDMEOAla9YAJHw9pIlbReJCEGabFsMibI0WHP4/DSdZlTbvbeVQL9aSj1LqnTAMr1lMT7sRZ7metY702LrTmtYcids65bN2s9CkGQFovrQLsKkgr+uVzH2koYB2LmnncCQCidAoODUh5FrRlXSsVA9kLQBOB01LQ/5ToW6y1M+T3xrgiCvnr2yOcSSaF8D8DKemZB56RhFCoAK8PeFi2rRXCbFtoQnBg1sHqJh3wN/5OkOErYH/z/Bbqqjcxo1rpagJ0ik8W6imsAoRXvEiD4uOpD8Ho0bl8b5DqgNgD++sobToCjJA6HxOhfbO6ZdaHUbRFr/i0EO6R5nVJqE8EH6+2CCEYicfs217EeIfSAQB0BMCLA4ZLHXJDntb+33gzlfjaxSSA/BnBppTwUMlZ6JX8bBJsbsAo+79momdk86nSsUZ4+FV3Xc6axuBppUGmQH0xcKwpPVdZFFcIVfgk/DNq/BiY9OdF/9Gmtepes7TrRgH6GpG4aVBoWc8knNfmNqefh8OUolYJ6e/eckwtOADJAen0xs/u1+QJO188bNgh2ncR9IvIkibC/WD5hjKELoHnBWF4TwTDJ/qhpv3oxgBcNWwY+mLgeBp6JRMZuLRabDpC8JLgQREku0pwu/6582GNBKzsdgq+mwmfPuKuWrt37pw8brtLvomH/34DT/f8HkmPrLc7ZtKIAAAAASUVORK5CYII='
]

const getData = () => {
  const params = {
    np: 1,
    fltt: 1,
    invt: 2,
    cb: `jQuery37107208853041718065_${new Date().getTime()}`,
    fs: "m:118",
    fields: "f12,f13,f14,f1,f2,f4,f3,f152,f17,f28,f15,f16,f124",
    fid: "f3",
    pn: 1,
    pz: 5,
    po: 1,
    ut: "fa5fd1943c7b386f172d6893dbfba10b",
    dect: 1,
    wbp2u: "|0|0|0|web",
    _: `${new Date().getTime()}`,
  };
  return new Promise((resolve, reject) => {
    axios
      .get("https://push2.eastmoney.com/api/qt/clist/get", { params })
      .then((res) => {
        res.data ? resolve(res.data) : resolve([]);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const sendMsg = (list) => {
  const html = `<div style="max-width:600px; margin:0 auto; background:#0a0c1a; border:2px solid #00f7ff33; border-radius:12px; box-shadow:0 0 30px rgba(0,247,255,0.1);">
      <!-- 标题 -->
      <div style="padding:25px 20px; background:linear-gradient(45deg, #00152e, #000716); border-bottom:2px solid #00f7ff;">
          <h1 style="margin:0; color:#00f7ff; font-size:32px; text-align:center; font-weight:800; letter-spacing:2px; text-shadow:0 0 15px #00f7ff80;">
              🚀 GOLD MARKET PULSE
          </h1>
      </div>
      <!-- 行情表格 -->
      <div style="padding:20px 15px;">
        ${list.map((item, i) => {
          const titleColor = getRandomColor()
          const textColor = getRandomColor()
          const url = icons[i]
          const time = dateFormater('YYYY-MM-DD hh:mm:ss', `${item.f124}000` * 1)
          return `<div style="margin-bottom:15px; padding:15px; background:#00122e; border:1px solid #00f7ff33; border-radius:8px;">
          <div style="display:flex; align-items:center; margin-bottom:10px; border-bottom:1px solid #00f7ff33; padding-bottom:8px;">
            <img src="${url}" style="width:32px; height:32px; margin-right:12px;">
            <span style="color:#fff; font-size:18px; font-weight:700;">${item.f14}</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
              <div>
                  <span style="color:${titleColor}; font-size:16px; font-weight:600;">今开</span>
                  <div style="color:${textColor}; font-size:22px; font-weight:700;">${item.f17}</div>
              </div>
              <div>
                  <span style="color:${titleColor}; font-size:16px; font-weight:600;">昨结</span>
                  <div style="color:${textColor}; font-size:22px; font-weight:700;">${item.f28}</div>
              </div>
              <div>
                  <span style="color:${titleColor}; font-size:16px; font-weight:600;">最高</span>
                  <div style="color:#fff; font-size:18px;">${item.f15}</div>
              </div>
              <div>
                  <span style="color:${titleColor}; font-size:16px; font-weight:600;">最低</span>
                  <div style="color:#fff; font-size:18px;">${item.f16}</div>
              </div>
              <div>
                  <span style="color:${titleColor}; font-size:12px;">更新时间</span>
                  <div style="color:#fff; font-size:16px;">${time}</div>
              </div>
          </div>
        </div>`
        }).join('')}        
      </div>
      <!-- 页脚 -->
      <div style="padding:20px; background:#000716; border-top:2px solid #00f7ff33; text-align:center;">
          <p style="margin:0; color:#fffc00; font-size:14px; line-height:1.6;">
              ⚡ 数据更新：${Time}<br>
              © 2025 · 实时行情追踪
          </p>
      </div>
  </div>`;
  sendMail(
    'clearhuan@qq.com',
    html,
    `【Gold Helper】By Github Actions`
  );
}

const main = async () => {
  const res = await getData();
  const result = JSON.parse(res.substring(res.indexOf("(") + 1, res.lastIndexOf(")")));
  const diff = result.data.diff;
  console.log(diff.length);
  sendMsg(diff);
  // const actualGolds = `var actualGolds = ${JSON.stringify(diff, null, 2)}`
  // fs.writeFile(filePath, actualGolds, 'utf-8', (err) => {
  //   if (err) {
  //     console.log('写入文件时出错：', err)
  //   } else {
  //     console.log('数据写入成功')
  //   }
  // })
};

main();
