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
}

module.exports = new VisitService();
