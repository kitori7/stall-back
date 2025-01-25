const connection = require("../app/database");

class StallUserService {
  async createUser(user) {
    try {
      const { username, password, phoneNumber, roleType } = user;
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
}

module.exports = new StallUserService();
