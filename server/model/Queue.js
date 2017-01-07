/*

  要采集的内容

  微信号wxId: myyjs_bud
  文章标题title:
  临时url:

*/

// const DataObject = require('./DataObject');

// class QueueArticle extends DataObject {
class Queue {

  static *insert(app) {
    // return yield DataObject.insert(app, 'apps');
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
    // return yield DataObject.list('apps');
    return [{
      tempUrl: 'http://mp.weixin.qq.com/s?timestamp=1483436698&src=3&ver=1&signature=atdTxYc-KwEL0lGrA8RbnEXGo6ER8fTZbKsomStHzt2j3z*jnoQFenA0Fxb3ixCIxO52NReg4yD-2Hq44mdngdAj4exlgTMSlw4jvIzO*oBX2M4vVCPtMNgY1vJhlwNtKUZvKzSlzFBhRIHA7oSzoxpKIE*ZrnM6AcexhzXGlxs=',
      title: '自从有了娃，秀恩爱的套路都变了'
    }]
  }
}

module.exports = Queue;
