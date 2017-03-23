/*


  微信号wxId：myyjs_bud
  永久url：
  微信文章号sn：
  微信msgId：
  文章标题title：
  发布时间：
  文章内容

*/

const db = require('./connect');
const DataObject = require('./DataObject');
const TABLE_NAME = 'articles';
const KEYS = ['id','sn','wx_id','title','publish_time','content','url'];
// class Articles extends DataObject {
class Articles {

  static *insert(article) {
    return yield DataObject.insert(article, TABLE_NAME);
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
  static async listByWxId(wxId) {

    const sql = `select * from ${TABLE_NAME} where wx_id = ? order by msg_id`;
    const result = await db.sql(sql, wxId);
    return await DataObject.factory(result);
  }
}

module.exports = Articles;
