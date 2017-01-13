require('isomorphic-fetch');
const co = require('co');
const Queue = require('../model/Queue');
let taskId = 0;

// 从队列获取url并爬取内容
let readQueue = co.wrap(function *() {
  try {

    let queueItem = yield Queue.pop();

    while(queueItem && taskId) {
      console.log((new Date()).toLocaleString(), 'task 开始爬取', queueItem.id, queueItem.title, queueItem.url);
      let response = yield fetch('http://127.0.0.1:7004/get_article_content?id=' + queueItem.id);
      let result = yield response.json();
      if(result.code === 0) {
        queueItem = yield Queue.pop();
      } else {
        console.log((new Date()).toLocaleString(), 'task 爬虫出错，任务暂停');
        queueItem = null;
        return;
      }
    }
    console.log((new Date()).toLocaleString(), 'task 队列中的文章爬取完成');

  } catch(error) {
    console.log((new Date()).toLocaleString(), 'task 文章爬取任务出错暂停', error);
  }

});

exports.start = function() {
  console.log((new Date()).toLocaleString(), 'task 文章爬取任务开始');
  readQueue();
  taskId = setInterval(readQueue, 1000*60*60*24); // 每天启动一次
}

exports.stop = function() {
  console.log((new Date()).toLocaleString(), 'task 文章爬取任务结束');
  clearInterval(taskId);
  taskId = 0;
}
