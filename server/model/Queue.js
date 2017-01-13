/*

  biz:
  微信文章号sn：
  微信msg_id：
  文章标题title：
  永久url：

*/

const db = require('./connect');
const DataObject = require('./DataObject');
const TABLE_NAME = 'queue';
const KEYS = ['id', 'biz', 'sn', 'msg_id', 'title', 'url'];

// class Queue extends DataObject {
class Queue {

  static *insert(article) {
    // 过滤掉emoji表情，避免数据库插入出错
    article.title = article.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');
    return yield DataObject.insert(article, TABLE_NAME);
  }
  static *insertMulti(articles) {
    // 过滤掉emoji表情，避免数据库插入出错
    articles.forEach(article => {
      article.title = article.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');
    });
    return yield DataObject.insertMulti(articles, TABLE_NAME, KEYS, 'sn');
  }
  static *remove(ids) {
    // return yield DataObject.remove(ids, 'apps');
  }
  static *update(article) {
    return yield DataObject.update(article, TABLE_NAME);
  }
  static *isExist(id) {
    // return yield DataObject.isExist(id, 'apps');
  }
  static *get(id) {
    return yield DataObject.get(id, TABLE_NAME);
  }
  // 获取最底部的一条
  static *pop() {
    const sql = `select * from ${TABLE_NAME} where state='new' order by id asc limit 0,1`;
    const result = yield db.sql(sql);
    return result[0];
  }
  static *list() {
    return yield DataObject.list(TABLE_NAME);
  }
}

module.exports = Queue;
