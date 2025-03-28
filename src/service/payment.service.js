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

  // 获取总流水
  async getPaymentTotal() {
    const sql = `SELECT SUM(amount) FROM stall_payment`;
    const [result] = await connection.execute(sql);
    return result[0]["SUM(amount)"];
  }

  // 获取摊位流水
  async getStallPaymentTotal(stallId) {
    const sql = `SELECT SUM(amount) FROM stall_payment WHERE stall_id = ?`;
    const [result] = await connection.execute(sql, [stallId]);
    return result[0]["SUM(amount)"];
  }

  // 获取摊位总订单数
  async getStallOrderTotal(stallId) {
    const sql = `SELECT COUNT(*) FROM stall_payment WHERE stall_id = ?`;
    const [result] = await connection.execute(sql, [stallId]);
    return result[0]["COUNT(*)"];
  }

  // 获取摊位折线图数据
  async getStallPaymentLine(stallId) {
    // 获取流水数据
    const paymentSql = `SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      SUM(amount) AS amount
    FROM stall_payment
    WHERE stall_id = ?
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`;
    const [paymentResult] = await connection.execute(paymentSql, [stallId]);

    // 获取订单数据
    const orderSql = `SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      COUNT(*) AS count
    FROM stall_payment
    WHERE stall_id = ?
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`;
    const [orderResult] = await connection.execute(orderSql, [stallId]);

    // 将两个结果合并成一个数组
    const mergedData = paymentResult.map((payment) => {
      const order = orderResult.find((order) => order.date === payment.date); // 找到相同日期的订单数据
      return {
        date: payment.date,
        amount: Number(payment.amount), // 保证金额是数字类型
        count: order ? order.count : 0, // 如果没有找到订单数据，默认为0
      };
    });

    return mergedData;
  }

  // 获取流水折线图数据
  async getPaymentLine() {
    // 获取流水数据
    const paymentSql = `SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      SUM(amount) AS amount
    FROM stall_payment
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`;
    const [paymentResult] = await connection.execute(paymentSql);

    // 获取订单数据
    const orderSql = `SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      COUNT(*) AS count
    FROM stall_payment
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`;
    const [orderResult] = await connection.execute(orderSql);

    // 将两个结果合并成一个数组
    const mergedData = paymentResult.map((payment) => {
      const order = orderResult.find((order) => order.date === payment.date); // 找到相同日期的订单数据
      return {
        date: payment.date,
        amount: Number(payment.amount), // 保证金额是数字类型
        count: order ? order.count : 0, // 如果没有找到订单数据，默认为0
      };
    });

    return mergedData;
  }

  // 根据摊位 id 获取所有支付记录
  async getPaymentsByStallId(stallId) {
    const sql = `SELECT amount, created_at AS createdAt, id FROM stall_payment WHERE stall_id = ?`;
    const [result] = await connection.execute(sql, [stallId]);
    return result;
  }
}

module.exports = new PaymentService();
