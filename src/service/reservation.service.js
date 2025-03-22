const connection = require("../app/database");
const configService = require("./config.service");

class ReservationService {
  async create(date, times, locationId, stallId) {
    // 检查自动审核开关状态
    const isAutoAudit = await configService.getAutoAuditStatus();

    const sql = `INSERT INTO reservation (date, times, location_id, stall_id, status) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(sql, [
      date,
      JSON.stringify(times),
      locationId,
      stallId,
      "0", // 初始状态为待审核
    ]);

    // 如果开启自动审核，则自动设置为审核通过
    if (isAutoAudit) {
      await this.auditReservation(result.insertId, "2"); // 2 表示审核通过
    }

    return result;
  }

  // 获取当天预约时段
  async getReservationTime(date, locationId) {
    const sql = `SELECT times FROM reservation WHERE date = ? AND location_id = ?`;
    const [result] = await connection.execute(sql, [date, locationId]);
    if (result.length === 0) {
      return [];
    }
    return result[0].times;
  }

  // 根据摊位 id 获取预约列表
  async getReservationListByStallId(stallId) {
    const sql = `
      SELECT
        r.id,
        r.date,
        r.times,
        l.location_name AS locationName,
        r.status,
        r.created_at AS createdAt
      FROM reservation r
      LEFT JOIN location l ON r.location_id = l.id
      WHERE r.stall_id = ?`;
    const [result] = await connection.execute(sql, [stallId]);
    return result;
  }

  // 删除预约
  async remove(id) {
    const sql = `DELETE FROM reservation WHERE id = ?`;
    const [result] = await connection.execute(sql, [id]);
    return result;
  }

  // 获取所有预约列表
  async getReservationList(offset, pageSize, stallName, phoneNumber, status) {
    let sqlStr = `
      SELECT
        s.id AS stallId,
        r.id,
        r.date,
        r.times,
        l.location_name AS locationName,
        r.status,
        r.reason,
        r.created_at AS createdAt,
        s.stall_name AS stallName,
        s.owner_phone_number AS phoneNumber
      FROM reservation r
      LEFT JOIN location l ON r.location_id = l.id
      LEFT JOIN stall s ON r.stall_id = s.id
      WHERE 1=1`;

    const params = [];
    if (stallName) {
      sqlStr += " AND s.stall_name LIKE ?";
      params.push(`%${stallName}%`);
    }
    if (phoneNumber) {
      sqlStr += " AND s.owner_phone_number LIKE ?";
      params.push(`%${phoneNumber}%`);
    }
    if (status) {
      sqlStr += " AND r.status = ?";
      params.push(status);
    }

    sqlStr += " ORDER BY r.status = '0' DESC, r.date DESC";

    const [result] = await connection.execute(sqlStr, params);
    return result;
  }

  // 修改预约状态
  async auditReservation(id, status, reason) {
    // 更新状态
    let sql = `UPDATE reservation SET status = ?`;
    const params = [];
    if (reason) {
      sql += ", reason = ?";
      params.push(reason);
    }
    sql += " WHERE id = ?";
    const [result] = await connection.execute(sql, [status, ...params, id]);
    return result;
  }
}

module.exports = new ReservationService();
