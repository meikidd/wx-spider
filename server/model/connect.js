const db = require('mysql-promise')();

db.configure({
  "host": "localhost",
  "user": "root",
  "password": "@2qwertyuiop",
  "database": "rearing"
});

db.sql = function *(sql, params) {
  try {
    const result = yield db.query(sql, params);
    return result[0];
  } catch(error) {
    console.error((new Date()).toLocaleString(), '- [db.sql error]. sql:', sql, '; params:', params);
    console.error(error);
    return null;
  }
};

module.exports = db;
