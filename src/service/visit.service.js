const connection = require("../app/database");
class VisitService {
  async create(userId, stallId, type, reservationId) {
    const sql = `INSERT INTO stall_visit (user_id, stall_id, type, reservation_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(sql, [
      userId,
      stallId,
      type,
      reservationId,
    ]);
    return result;
  }
  async getVisitTotal() {
    const sql = `SELECT COUNT(*) FROM stall_visit`;
    const [result] = await connection.execute(sql);
    return result[0]["COUNT(*)"];
  }

  // 获取访问量信息
  async getVisitInfo() {
    const sql = `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN type = 1 THEN 1 ELSE 0 END) AS qrVisit,
        SUM(CASE WHEN type = 2 THEN 1 ELSE 0 END) AS linkVisit
      FROM stall_visit
    `;
    const [result] = await connection.execute(sql);
    return [
      {
        type: "二维码访问",
        value: (result[0].qrVisit / result[0].total) * 100,
      },
      {
        type: "链接访问",
        value: (result[0].linkVisit / result[0].total) * 100,
      },
    ];
  }

  // 获取访问量折线图数据
  async getVisitLine() {
    const sql = `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
        COUNT(*) AS count
      FROM stall_visit
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
    `;
    const [result] = await connection.execute(sql);
    return result;
  }
}

module.exports = new VisitService();
