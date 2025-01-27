const connection = require("../app/database");

class StallUserService {
  async createUser(username, password, phoneNumber, roleType) {
    try {
      const sql = `
      INSERT INTO stall_user (username, password, phone_number, role_type)
      VALUES (?, ?, ?, ?)
    `;
      const [result] = await connection.execute(sql, [
        username,
        password,
        phoneNumber,
        roleType,
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByUserName(userName) {
    const sql = `
        SELECT * FROM stall_user WHERE username = ?
      `;
    const [result] = await connection.execute(sql, [userName]);
    return result;
  }

  async getUserById(id) {
    const sql = `
        SELECT username,phone_number phoneNumber,role_type roleType ,avatar FROM stall_user WHERE id = ?
      `;
    const [result] = await connection.execute(sql, [id]);
    return result[0];
  }
}

module.exports = new StallUserService();
