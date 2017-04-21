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

  static async insert(article) {
    return await DataObject.insert(article, TABLE_NAME);
  }
  static *insertMulti(articles) {
    return yield DataObject.insertMulti(articles, TABLE_NAME, KEYS, 'sn');
  }
  static *remove(ids) {
    // return yield DataObject.remove(ids, 'apps');
  }
  static *update(article) {
    return yield DataObject.update(article, TABLE_NAME);
  }
  static *isExist(id) {
    return yield DataObject.isExist(id, TABLE_NAME);
  }
  static async isSnExist(sn) {
    const sql = `select * from ${TABLE_NAME} where sn=?`;
    const result = await db.sql(sql, sn);
    return result.length > 0;
  }
  static *get(id) {
    return yield DataObject.get(id, TABLE_NAME);
  }
  static async getMinMsgIdByBizId(bizId) {
    const sql = `select * from ${TABLE_NAME} where biz_id=? order by msg_id asc limit 0,1`;
    const result = await db.sql(sql, bizId);
    return result[0].msg_id;
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
