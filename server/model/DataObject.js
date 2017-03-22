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

  static async factory(props) {
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
  static async insert(item, tableName) {
    const isExist = false;
    if(item.id) {
      isExist = await DataObject.isExist(item.id, tableName);
    }
    if (isExist) {
      await DataObject.update(item, tableName);
    } else {
      if(item.id) {
        delete item.id; // 去掉无效id
      }
      const sql = `insert into ${tableName} set ?`;
      const result = await db.sql(sql, item);
      item.id = result.insertId;
      return await DataObject.factory(item);
    }
  }

  /* 批量新增 items，如果已存在，则忽略。默认根据id判断是否存在，也可以传入参数pkKeyName来指定 */
  static async insertMulti(items, tableName, keys, pkKeyName) {
    if(!items || !items.length) {
      return [];
    }
    if(!pkKeyName) {
      pkKeyName = 'id';
    }
    // 先判断是否存在
    const pkValues = items.map(item => `\'${item[pkKeyName]}\'`);
    const existSql = `select * from ${tableName} where ${pkKeyName} in (${pkValues.join()})`;
    const existValues = await db.sql(existSql);
    if(existValues && existValues.length) {
      existValues.forEach(existValue => {
        const findIndex = items.findIndex(item => item[pkKeyName] == existValue[pkKeyName]);
        items.splice(findIndex, 1);
      });
    }
    // 将sql拼接成'insert into tablename (key1,key2) values (value1-1,value1-2),(value2-1,value2-2)'的形式
    const values = items.map(item => {
      let itemValue = '(';
      keys.forEach((key, i) => {
        if(i !== 0) {
          itemValue += ',';
        }
        if(!item[key]) {
          itemValue += null;
        } else if(/^[0-9]+$/.test(item[key])) {
          itemValue += item[key];
        } else {
          itemValue += '"' + item[key] + '"';
        }
      });
      itemValue += ')';
      return itemValue;
    });
    const insertSql = `insert into ${tableName} (${keys.join()}) values ${values.join()}`;
    const result = await db.sql(insertSql);
    return await DataObject.factory(items);

  }

  /* 删除 item */
  static async remove(ids, tableName) {
    if(typeof ids === 'string') {
      ids = [ids];
    }
    const sql = `delete ${tableName} where id in (?)`;
    await db.sql(sql, ids);
    return ids;
  }

  /* 更新 item */
  static async update(item, tableName) {
    const isExist = await DataObject.isExist(item.id, tableName);
    if (isExist) {
      const sql = `update ${tableName} set ? where id=?`;
      await db.sql(sql, [item, item.id]);
      return await DataObject.factory(item);
    }
  }

  /* 判断 item 是否存在 */
  static async isExist(id, tableName) {
    const sql = `select * from ${tableName} where id=?`;
    const result = await db.sql(sql, id);
    return result.length > 0;
  }

  /* 根据 id 查询 item */
  static async get(id, tableName) {
    const sql = `select * from ${tableName} where id=?`;
    const result = await db.sql(sql, id);
    return await DataObject.factory(result[0]);
  }

  /* 查询 item 列表 */
  static async list(tableName) {
    const sql = `select * from ${tableName}`;
    const result = await db.sql(sql);
    return await DataObject.factory(result);
  }
}
module.exports = DataObject;
