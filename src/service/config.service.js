const connection = require("../app/database");

class ConfigService {
  // 获取自动审核开关状态
  async getAutoAuditStatus() {
    const sql = `SELECT value FROM config WHERE \`key\` = 'auto_audit'`;
    const [result] = await connection.execute(sql);
    return result.length > 0 ? result[0].value === "1" : false;
  }

  // 设置自动审核开关状态
  async setAutoAuditStatus(status) {
    const value = status ? "1" : "0";
    const sql = `INSERT INTO config (\`key\`, value) VALUES ('auto_audit', ?) 
                 ON DUPLICATE KEY UPDATE value = ?`;
    const [result] = await connection.execute(sql, [value, value]);
    return result;
  }
}

module.exports = new ConfigService();
