const connection = require("../app/database");

class UserService {
  async create(userInfo) {
    const { username, password } = userInfo;
    const sql = "INSERT INTO admin_user (username, password) VALUES (?, ?)";
    const [result] = await connection.execute(sql, [username, password]);
    return result;
  }

  async getUserByUsername(username) {
    const sql = "SELECT * FROM admin_user WHERE username = ?";
    const [result] = await connection.execute(sql, [username]);
    return result;
  }

  async getAllUsers(offset, limit, username, rolesId) {
    try {
      let sql = `
        SELECT au.id, au.username, au.roles_id roleId, ar.role_name roleName, au.created_at createdAt, au.updated_at updatedAt
        FROM admin_user au 
        LEFT JOIN admin_roles ar ON au.roles_id = ar.id 
        WHERE 1=1
      `;
      const params = [];

      if (username) {
        sql += " AND au.username LIKE ?";
        params.push(`%${username}%`);
      }

      if (rolesId) {
        sql += " AND au.roles_id = ?";
        params.push(rolesId);
      }

      if (offset && limit) {
        sql += " LIMIT ?, ?";
        params.push(Number(offset), Number(limit));
      }

      const [result] = await connection.execute(sql, [...params]);
      return result;
    } catch (error) {
      return [];
    }
  }

  async getUserById(id) {
    const sql = `SELECT au.id, au.username, au.roles_id rolesId
    FROM admin_user AS au 
    WHERE au.id = ?`;
    const [result] = await connection.execute(sql, [id]);
    return result[0];
  }

  async updateUser(id, userInfo) {
    try {
      const { rolesId, password } = userInfo;
      let sql = "UPDATE admin_user SET roles_id = ?";
      const params = [rolesId];

      if (password) {
        sql += ", password = ?";
        params.push(password);
      }

      sql += " WHERE id = ?";
      params.push(id);

      const [result] = await connection.execute(sql, params);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(id) {
    const sql = "DELETE FROM admin_user WHERE id = ?";
    const [result] = await connection.execute(sql, [id]);
    return result;
  }
}

module.exports = new UserService();
