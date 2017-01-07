/*

  要采集的内容

  微信号wxId：myyjs_bud
  公众号名称wxName：萌芽研究所BUD
  公众号logo：

*/

// const DataObject = require('./DataObject');

// class Account extends DataObject {
class Account {

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
      name: '萌芽研究所BUD',
      wxId: 'myyjs_bud',
      history: 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzA5NjUwOTYwOA==&uin=Mjg4OTA1OTM1&key=947802bd93ab5df031ff13c3c750c5e2eeae907dfa66b987a248558272dbc745b3cfef3f7484144941f62a7e7d8ecb003d41f9ccfdf1e603405c47732f0f030ca5c09f1a5b5653f518198487ab149bdb&devicetype=iOS10.1.1&version=16050223&lang=zh_CN&nettype=WIFI&ascene=3&fontScale=100&pass_ticket=61a7gUsWwNjzxY8ei56oQP3I5St0u0i7jRYrI5t56c%2F6%2FhVCkTNdbSJtxeJyLEzm&wx_header=1' // TODO 手机端访问的历史消息页面url，是否会过期？
    // }, {
      // name: '科学家庭育儿',
      // wxId: 'icuiyutao'
    }]
  }
}

module.exports = Account;
