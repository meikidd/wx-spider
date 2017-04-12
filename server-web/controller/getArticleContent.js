// const co = require('co');
// const Spider = require('../spider/wx-detail.js');
// const Queue = require('../model/Queue.js');
// const Articles = require('../model/Articles.js');

// module.exports = co.wrap(function * (ctx) {
//   let queueItem = yield Queue.get(ctx.query.id);

//   try {
//     let article = yield Spider.start(queueItem);
//     if(article.error) {
//       console.log((new Date()).toLocaleString(), '爬取数据异常', queueItem.sn, article);
//     } else {
//       yield Articles.insert(article);
//     }
//     queueItem.state = 'done';
//     yield Queue.update(queueItem);

//     ctx.body = {
//       status: 'success',
//       code: 0,
//       article
//     }

//   } catch(error) {
//     throw error;
//     ctx.body = {
//       status: 'error',
//       code: 500,
//       error
//     }
//   }
// });
