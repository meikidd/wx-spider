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
const KEYS = ['id','sn','wx_id','title','publish_time','content','url'];
// class Articles extends DataObject {
class Articles {

  static *insert(article) {
    // 过滤掉emoji表情，避免数据库插入出错
    article.title = article.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');
    article.content = article.content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');
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
}

module.exports = Articles;
