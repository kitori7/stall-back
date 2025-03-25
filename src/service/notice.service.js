const connection = require("../app/database");

class NoticeService {
  async sendNotice(stallId, type, content, adminId) {
    const fields = ["stall_id", "type", "content"];
    const values = [stallId, type, content];

    if (adminId) {
      fields.push("admin_id");
      values.push(adminId);
    }

    const placeholders = values.map(() => "?").join(", ");
    const sql = `INSERT INTO notice (${fields.join(
      ", "
    )}) VALUES (${placeholders})`;

    const [result] = await connection.execute(sql, values);
    return result;
  }

  // 获取未读通知数量
  async getUnreadNoticeCount(stallId) {
    const sql = `
      SELECT COUNT(*) FROM notice WHERE stall_id = ? AND is_read = '0'
    `;

    const [result] = await connection.execute(sql, [stallId]);
    return result[0];
  }

  // 已读通知
  async readReservationNotice(id) {
    const sql = `UPDATE notice SET is_read = '1' WHERE id = ?`;
    const [result] = await connection.execute(sql, [id]);
    return result;
  }

  async getNoticeListByStallId(stallId) {
    const sql = `
      SELECT 
        id, 
        stall_id as stallId, 
        type, 
        content,
        is_read as isRead,
        created_at as createdAt 
      FROM notice 
      WHERE stall_id = ? 
      ORDER BY is_read ASC, created_at DESC
    `;

    const [result] = await connection.execute(sql, [stallId]);
    return result;
  }

  // 获取所有通知
  async getAllReservationNotice(stallName, adminName, type) {
    let sql = `
      SELECT 
        n.id, 
        n.stall_id as stallId, 
        n.type, 
        n.content, 
        n.is_read as isRead,
        n.created_at as createdAt,
        au.username as adminName,
        s.stall_name as stallName
      FROM notice n
      LEFT JOIN admin_user au ON n.admin_id = au.id
      LEFT JOIN stall s ON n.stall_id = s.id
      WHERE 1=1
    `;

    const params = [];

    if (stallName) {
      sql += ` AND s.stall_name LIKE ?`;
      params.push(`%${stallName}%`);
    }

    if (adminName) {
      sql += ` AND au.username LIKE ?`;
      params.push(`%${adminName}%`);
    }

    if (type) {
      sql += ` AND n.type = ?`;
      params.push(type);
    }

    sql += ` ORDER BY n.created_at DESC`;

    const [result] = await connection.execute(sql, params);
    return result;
  }

  // 删除通知
  async deleteReservationNotice(id) {
    const sql = `DELETE FROM notice WHERE id = ?`;
    const [result] = await connection.execute(sql, [id]);
    return result;
  }
}
module.exports = new NoticeService();
