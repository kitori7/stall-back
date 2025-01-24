const connection = require("../app/database");

class PermissionService {
  // 创建权限
  async create(name, code) {
    console.log(name, code);

    const statement = `INSERT INTO admin_permissions (permission_name, permission_code) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [name, code]);
    return result;
  }

  // 获取权限列表
  async list() {
    const statement = `SELECT id, permission_name permissionName, permission_code permissionCode, created_at createdAt, updated_at updatedAt FROM admin_permissions;`;
    const [result] = await connection.execute(statement);
    return result;
  }

  // 更新权限
  async update(id, name, code) {
    const statement = `UPDATE admin_permissions SET permission_name = ?, permission_code = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [name, code, id]);
    return result;
  }

  // 删除权限
  async remove(id) {
    const statement = `DELETE FROM admin_permissions WHERE id = ?;`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }
}

module.exports = new PermissionService();
