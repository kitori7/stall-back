const mysql = require("mysql2");

const connectionPool = mysql.createPool({
  host: "159.138.150.5",
  port: 3306,
  user: "stall_db",
  password: "nRRAMwd8fFZGnkmR",
  database: "stall_db",
  connectionLimit: 10,
});

connectionPool.getConnection((err, connection) => {
  if (err) {
    console.error("数据库连接失败", err);
  } else {
    connection.connect((err) => {
      if (err) {
        console.error("数据库交互失败", err);
      } else {
        console.log("数据库连接成功");
      }
    });
  }
});

const connection = connectionPool.promise();

module.exports = connection;
