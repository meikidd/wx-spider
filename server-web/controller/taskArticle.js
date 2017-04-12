// const co = require('co');
// const task = require('../task/article.js');

// module.exports = co.wrap(function * (ctx) {

//   if(ctx.query.start) {
//     task.start();
//   } else if(ctx.query.stop) {
//     task.stop();
//   }

//   yield ctx.render('taskArticle', Object.assign(ctx.query, {start:null, stop:null}));
// });
