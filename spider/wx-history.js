//
require('isomorphic-fetch');

const Queue = require('../model/Queue.js');
const ArticleParser = require('../parser/ArticleParser.js');
const co = require('co');

getArticle();

function getArticle(article) {

  const url = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MjM5MzAzNTQyMA==&uin=Mjg4OTA1OTM1&key=013e6985039e33932f9873d2d827707be29f244d21135d0ff9119896997a879595528a31ce2d62f225939f384e5bbd7be045805b8ea2a4edb2e6a6cb32833d7e68536199b989096a6a47e5060fe9ce88&f=json&frommsgid=1000000169&count=10&uin=Mjg4OTA1OTM1&key=013e6985039e33932f9873d2d827707be29f244d21135d0ff9119896997a879595528a31ce2d62f225939f384e5bbd7be045805b8ea2a4edb2e6a6cb32833d7e68536199b989096a6a47e5060fe9ce88&pass_ticket=SSPAqVjX7m8uHnJK%25252BRoL5zkTPbAMD7Fiqn%25252BkJOLPMBhPs0BpviWCYl%25252BKoY5aTYMU&wxtoken=&x5=0';
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,ru;q=0.2,pt;q=0.2,es;q=0.2,zh-TW;q=0.2',
      'Cache-Control': 'no-cache',
      'Host': 'mp.weixin.qq.com',
      'Pragma': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
      'Cookie': 'pac_uid=1_466392519; mobileUV=1_1569dd2b927_ec429; tvfe_boss_uuid=76ee9c4f05753529; ts_uid=7831570572; pgv_pvi=7292570624; aboutVideo_v=0; noticeLoginFlag=1; remember_acct=meikidd%40qq.com; ua_id=jiOpzIM5Qyx6vKbzAAAAAH6LjLOw428Lyx-v65pJbRI=; xid=f9a53972b239a1a4436427c059e2d471; openid2ticket_oB_Rqw-RIHPvKSMCXduWya0hj02U=gksP199QTmd41frhMQFJYXN7T9sViLV7/XZTdsF2MD4=; RK=GG2KjcdnE3; ptcz=3724138a6e5cd74f00177acaad0f32d7e83ec23238991d56ec48cf59463a03e2; pt2gguin=o0466392519; sd_userid=59521483098526104; sd_cookie_crttime=1483098526104; pgv_info=ssid=s9822764930; pgv_pvid=9128862610; o_cookie=466392519; sig=h01591c321ce6eca706d8108965d1e6dbf0a6805b8adf497cbb723ccc9c036548a31d87e0e97659441c; wap_sid=CM+14YkBEkBUVk5PLWZKZHBRaE1NRFB3ZXFpTi1NY0tkU2VZSXUtcDZ0VFh4NFYtc2dmQkd4cTE1NWVTem9TS3VucDh1ZXc2GAQg/REonKWL9QgwmPOzwwU=; wap_sid2=CM+14YkBElxaSTBZUW1oMV96WEVaektBaFhTTHpjcXpvQW5mV21icVdXOFdEWS1sWFVYdkVYcVN6eERyMkE1dXdGYVFxU1p0akVPcFBiU05uQW8ybzVQMzBiM3prM1lEQUFBfg==' // cookie是否会过期
    }
  })
  .then(function(response) {
    if (response.status !== 200) {
      throw new Error('Bad response from server');
    } else {
      return response.json();
    }
  })
  .then(function(data) {
    console.log('文章详情:', data);
  })
  .catch(function(error) {
    console.error('Url:', url);
    console.error(error);
  });
}
