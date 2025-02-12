const connection = require("../app/database");

class CommentService {
  async createComment(userId = 0, stallId, content, rating) {
    const sql = `INSERT INTO stall_comment (user_id, stall_id, content, rating) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(sql, [
      userId,
      stallId,
      content,
      rating || null, // 如果 rating 为空则插入 null
    ]);
    return result;
  }

  async getCommentsByStallId(stallId, offset, pageSize) {
    let sql = `SELECT sc.id, sc.content, sc.rating, sc.created_at createdAt,
    su.username, su.role_type roleType, su.avatar
    FROM stall_comment sc
    LEFT JOIN stall_user su ON sc.user_id = su.id
  `;
    const params = [];

    // 确保 stallId 是有效的
    if (stallId !== undefined && stallId !== null) {
      sql += " WHERE sc.stall_id = ?";
      params.push(Number(stallId)); // 确保它是数字类型
    }

    // 执行 SQL 查询
    const [result] = await connection.execute(sql, params);
    return result;
  }
}

module.exports = new CommentService();
