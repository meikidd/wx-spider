const util = require('util');
const db = require('./connect');

/*
  数据库操作基础类，包含基本的insert/remove/update/isExist/get/list等行为
*/
class DataObject {

  constructor(props) {
    // this.fields = [];
    Object.keys(props).forEach(field => {
      this[field] = props[field];
      // this.fields.push(field);
    });
  }
  // toObject() {
  //   let data = {};
  //   this.fields.forEach(field => {
  //     data[field] = this[field];
  //   });
  //   return data;
  // }
  // toString() {
  //   return this.toObject().toString();
  // }

  static *factory(props) {
    if (util.isArray(props)) {
      // 如果参数是数组，则创建一个 DataObject 的数组
      let items = [];
      for (var i = 0; i < props.length; i++) {
        let item = new DataObject(props[i]);
        items.push(item);
      }
      return items;
    } else {
      let item = new DataObject(props);
      return item;
    }
  }

  /* 新增 item，如果已存在，则更新 */
  static *insert(item, tableName) {
    const isExist = false;
    if(item.id) {
      isExist = yield DataObject.isExist(item.id, tableName);
    }
    if (isExist) {
      yield DataObject.update(item, tableName);
    } else {
      if(item.id) {
        delete item.id; // 去掉无效id
      }
      const sql = `insert into ${tableName} set ?`;
      const result = yield db.sql(sql, item);
      item.id = result.insertId;
      return yield DataObject.factory(item);
    }
  }

  /* 删除 item */
  static *remove(ids, tableName) {
    if(typeof ids === 'string') {
      ids = [ids];
    }
    const sql = `delete ${tableName} where id in (?)`;
    yield db.sql(sql, ids);
    return ids;
  }

  /* 更新 item */
  static *update(item, tableName) {
    const isExist = yield DataObject.isExist(item.id, tableName);
    if (isExist) {
      const sql = `update ${tableName} set ? where id=?`;
      yield db.sql(sql, [item, item.id]);
      return yield DataObject.factory(item);
    }
  }

  /* 判断 item 是否存在 */
  static *isExist(id, tableName) {
    const sql = `select * from ${tableName} where id=?`;
    const result = yield db.sql(sql, id);
    return result.length > 0;
  }

  /* 根据 id 查询 item */
  static *get(id, tableName) {
    const sql = `select * from ${tableName} where id=?`;
    const result = yield db.sql(sql, id);
    return yield DataObject.factory(result[0]);
  }

  /* 查询 item 列表 */
  static *list(tableName) {
    const sql = `select * from ${tableName}`;
    const result = yield db.sql(sql);
    return yield DataObject.factory(result);
  }
}
module.exports = DataObject;
