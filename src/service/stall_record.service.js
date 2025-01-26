const connection = require("../app/database");

class StallRecordService {
  async createRecord(stallId, status, reason = null) {
    const sql = `
      INSERT INTO stall_record (stall_id, status, reason)
      VALUES (?, ?, ?)
    `;
    const [result] = await connection.execute(sql, [stallId, status, reason]);
    return result;
  }

  // 获取审核时间线
  async getTimeline(stallId) {
    const sql = `SELECT id,stall_id stallId,status,reason,created_at createdAt  FROM stall_record WHERE stall_id = ? ORDER BY created_at ASC;`;
    const [result] = await connection.execute(sql, [stallId]);
    return result;
  }
}

module.exports = new StallRecordService();
