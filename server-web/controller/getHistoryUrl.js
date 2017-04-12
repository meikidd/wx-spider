// const co = require('co');
// const Spider = require('../spider/wx-history.js');
// const Queue = require('../model/Queue.js');

// module.exports = co.wrap(function * (ctx) {

//   const {url, msgid, cookies} = ctx.query;
//   let {error, articles, lastMsgId, isLastPage} = yield Spider.start(url, msgid, cookies);
//   // articles 存入数据库
//   yield Queue.insertMulti(articles);
//   console.log('爬取', articles.length, '条');
//   // lastMsgId 存入数据库
//   console.log('最后一条的id是', lastMsgId);
//   if(error) {
//     ctx.body = '<div>'+error.message+'</div><a href="?url='+encodeURIComponent(url)+'&msgid='+lastMsgId+'">走起</a>';
//     throw error;
//   } else {
//     ctx.body = '爬取结束，共' + articles.length + '条';
//   }
// });
