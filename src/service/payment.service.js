const connection = require("../app/database");

class PaymentService {
  async create(amount, reservationId, stallId) {
    const sql = `INSERT INTO stall_payment (amount, reservation_id, stall_id) VALUES (?, ?, ?)`;
    const [result] = await connection.execute(sql, [
      amount,
      reservationId,
      stallId,
    ]);
    return result;
  }
}

module.exports = new PaymentService();
