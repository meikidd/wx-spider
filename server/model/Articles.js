/*


  微信号wxId：myyjs_bud
  永久url：
  微信文章号sn：
  微信msgId：
  文章标题title：
  发布时间：
  文章内容

*/

const DataObject = require('./DataObject');
const TABLE_NAME = 'articles';
const KEYS = ['id', 'wx_id', 'sn', 'msg_id', 'title', 'publish_time', 'content'];

// class Articles extends DataObject {
class Articles {

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

module.exports = Articles;


const co = require('co');
co(function *() {
  // yield Articles.insert({sn:121, msg_id:121, title:'hello', publish_time:new Date()});

  yield Articles.insertMulti([
    {sn:19, msg_id:121, title:'hello', publish_time: '2017-01-10'},
    {sn:21, msg_id:122, title:'hello', publish_time: '2017-01-10'}
  ]);

  // let list = yield Articles.list();
  // console.log(list);
});
