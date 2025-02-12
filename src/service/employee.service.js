const connection = require("../app/database");

class EmployeeService {
  // 创建员工
  async createEmployee(name, phoneNumber, idCard, healthImg, stallId) {
    try {
      const sql = `
      INSERT INTO stall_employees
      (name, phone_number, id_number, health_certificate, stall_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
      const [result] = await connection.execute(sql, [
        name,
        phoneNumber,
        idCard,
        healthImg,
        stallId,
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  // 更新员工信息
  async updateEmployee(id, employee) {
    const { name, phoneNumber, idCard, healthImg } = employee;
    const sql = `
      UPDATE stall_employees
      SET name = ?, phone_number = ?, id_number = ?, health_certificate = ?
      WHERE id = ?
    `;
    const [result] = await connection.execute(sql, [
      name,
      phoneNumber,
      idCard,
      healthImg,
      id,
    ]);
    return result;
  }
}

module.exports = new EmployeeService();
