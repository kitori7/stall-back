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
}

module.exports = new ReservationService();
