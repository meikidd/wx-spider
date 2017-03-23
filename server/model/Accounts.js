/*

  要采集的内容

  微信号wxId：myyjs_bud
  公众号名称wxName：萌芽研究所BUD
  公众号logo：

*/

const DataObject = require('./DataObject');
const TABLE_NAME = 'accounts';

// class Account extends DataObject {
class Account {

  static async insert(app) {
    return await DataObject.insert(app, TABLE_NAME);
  }
  static async remove(ids) {
    return await DataObject.remove(ids, TABLE_NAME);
  }
  static async update(app) {
    // return await DataObject.update(app, 'apps');
  }
  static async isExist(id) {
    // return await DataObject.isExist(id, 'apps');
  }
  static async get(id) {
    return await DataObject.get(id, TABLE_NAME);
  }
  static async list() {
    return await DataObject.list(TABLE_NAME);
  }
}

module.exports = Account;
