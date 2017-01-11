/*

  biz:
  微信文章号sn：
  微信msg_id：
  文章标题title：
  永久url：

*/

const DataObject = require('./DataObject');
const TABLE_NAME = 'queue';
const KEYS = ['id', 'biz', 'sn', 'msg_id', 'title', 'url'];

// class Queue extends DataObject {
class Queue {

  static *insert(article) {
    return yield DataObject.insert(article, TABLE_NAME);
  }
  static *insertMulti(articles) {
    return yield DataObject.insertMulti(articles, TABLE_NAME, KEYS, 'sn');
  }
  static *remove(ids) {
    // return yield DataObject.remove(ids, 'apps');
  }
  static *update(app) {
    // return yield DataObject.update(app, 'apps');
  }
  static *isExist(id) {
    // return yield DataObject.isExist(id, 'apps');
  }
  static *get(id) {
    // return yield DataObject.get(ids, 'apps');
  }
  static *list() {
    return yield DataObject.list(TABLE_NAME);
  }
}

module.exports = Queue;


const co = require('co');
co(function *() {
  // yield Queue.insert({sn:121, msg_id:121, title:'hello', publish_time:new Date()});

  // yield Queue.insertMulti([
  //   {sn:3, msg_id:121, title:'hello', 'biz': '111', url: 'fake url'},
  //   {sn:4, msg_id:122, title:'hello', 'biz': '111', url: 'fake url'}
  // ]);

  // let list = yield Queue.list();
  // console.log(list);
});
