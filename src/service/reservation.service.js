const connection = require("../app/database");

class ReservationService {
  async create(date, time, locationId, stallId) {
    const sql = `INSERT INTO reservation (date, time, location_id, stall_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(sql, [
      date,
      time,
      locationId,
      stallId,
    ]);
    return result;
  }

  // 获取当天预约时段
  async getReservationTime(date, locationId) {
    const sql = `SELECT time FROM reservation WHERE date = ? AND location_id = ?`;
    const [result] = await connection.execute(sql, [date, locationId]);
    return result;
  }

  // 根据摊位 id 获取预约列表
  async getReservationListByStallId(stallId) {
    const sql = `
      SELECT
        JSON_ARRAYAGG(r.id) AS ids,
        r.date,
        JSON_ARRAYAGG(r.time) AS times,
        l.location_name AS locationName,
        r.created_at AS createdAt
      FROM reservation r
      LEFT JOIN location l ON r.location_id = l.id
      WHERE r.stall_id = ?
      GROUP BY r.date`;
    const [result] = await connection.execute(sql, [stallId]);
    return result;
  }

  // 删除预约
  async remove(id) {
    const sql = `DELETE FROM reservation WHERE id = ?`;
    const [result] = await connection.execute(sql, [id]);
    return result;
  }
}

module.exports = new ReservationService();
