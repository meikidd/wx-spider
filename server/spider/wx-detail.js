require('isomorphic-fetch');

const ArticleParser = require('../parser/ArticleParser.js');

exports.start = function *(article) {

  const url = article.url;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,ru;q=0.2,pt;q=0.2,es;q=0.2,zh-TW;q=0.2',
      'Cache-Control': 'no-cache',
      'Host': 'mp.weixin.qq.com',
      'Pragma': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
      'Cookie': 'pac_uid=1_466392519; mobileUV=1_1569dd2b927_ec429; tvfe_boss_uuid=76ee9c4f05753529; ts_uid=7831570572; pgv_pvi=7292570624; aboutVideo_v=0; noticeLoginFlag=1; remember_acct=meikidd%40qq.com; RK=GG2KjcdnE3; ptcz=3724138a6e5cd74f00177acaad0f32d7e83ec23238991d56ec48cf59463a03e2; pt2gguin=o0466392519; sd_userid=59521483098526104; sd_cookie_crttime=1483098526104; pgv_info=ssid=s9822764930; pgv_pvid=9128862610; o_cookie=466392519; sig=h01631a0985e24c1b24039c508b7b58b0d4790ef55faea53ed54590ff8a77ac86a479f57918fa1c1c27; wap_sid=CM+14YkBEkBUU092NWNsM3JkZGFCMG1PeXgxUzZFaHlxa3RzWVhZdHMwUUpPOVYwNzJZQVA1REhKSzhZN3RMY0NGWEFjMEpBGAQg/REoqPnDxAswpZiuwwU=; wap_sid2=CM+14YkBElxOV0Jta0pmWGRFVHptS1dSVElmRTk3bVoxV2hjaHFtY1B3QkhseUNvSGlQLThVQXpsY3lzTnc2bnp0Y2YzaGpMR2xUZklEV2w1bHlwb2t3dUNQYmROblVEQUFBfg==' // cookie是否会过期
    }
  })
  .then(function(response) {
    if (response.status !== 200) {
      throw new Error('Bad response from server');
    } else {
      return response.text();
    }
  })
  .then(function(body) {
    return ArticleParser.parse(body);
  })
  /*.catch(function(error) {
    console.error('Url:', url);
    console.error(error);
  })*/;
}
