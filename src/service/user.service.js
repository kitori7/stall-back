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
}

module.exports = new UserService();
