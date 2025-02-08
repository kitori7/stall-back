const connection = require("../app/database");

class CommentService {
  async createComment(userId, stallId, content, rating) {
    const sql = `INSERT INTO stall_comment (user_id, stall_id, content, rating) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(sql, [
      userId,
      stallId,
      content,
      rating,
    ]);
    return result;
  }

  async getCommentsByStallId(stallId, offset, pageSize) {
    console.log(stallId, offset, pageSize);
    let sql = `SELECT sc.id, sc.content, sc.rating, sc.created_at createdAt,
    su.username, su.role_type roleType
    FROM stall_comment sc
    LEFT JOIN stall_user su ON sc.user_id = su.id
    WHERE sc.stall_id = ?`;
    const params = [stallId];

    // 如果 offset 和 pageSize 都有值，则添加分页限制
    if (offset && pageSize) {
      sql += " LIMIT ?, ?";
      params.push(Number(offset), Number(pageSize));
    }

    const [result] = await connection.execute(sql, params);
    return result;
  }
}

module.exports = new CommentService();
