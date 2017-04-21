/*

  要采集的内容

  微信号wxId：myyjs_bud
  公众号名称wxName：萌芽研究所BUD
  公众号logo：

*/

const DataObject = require('./DataObject');
const TABLE_NAME = 'accounts';
const db = require('./connect');

// class Account extends DataObject {
class Account {

  static async insert(account) {
    return await DataObject.insert(account, TABLE_NAME);
  }
  static async remove(ids) {
    return await DataObject.remove(ids, TABLE_NAME);
  }
  static async update(account) {
    return await DataObject.update(account, TABLE_NAME);
  }
  static async isExist(id) {
    // return await DataObject.isExist(id, 'apps');
  }
  static async get(id) {
    return await DataObject.get(id, TABLE_NAME);
  }
  static async getByBizId(bizId) {
    const sql = `select * from ${TABLE_NAME} where biz_id = ?`;
    const result = await db.sql(sql, bizId);
    return await DataObject.factory(result[0]);
  }
  static async list() {
    return await DataObject.list(TABLE_NAME);
  }
  static async getFromMsgId(id) {
    
  }
}

module.exports = Account;
