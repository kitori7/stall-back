const connection = require("../app/database");

class MenuService {
  // 创建菜单
  async create(menuName, routeName) {
    const statement = `INSERT INTO admin_menu (menu_name, route_name) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [menuName, routeName]);
    return result;
  }

  // 删除菜单
  async remove(id) {
    const statement = `DELETE FROM admin_menu WHERE id = ?;`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }

  // 修改菜单
  async update(id, menuName, routeName) {
    const statement = `UPDATE admin_menu SET menu_name = ?, route_name = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [
      menuName,
      routeName,
      id,
    ]);
    return result;
  }

  // 查询所有菜单
  async getAllMenus() {
    const statement = `SELECT id, menu_name menuName, route_name routeName, created_at createdAt, updated_at updatedAt FROM admin_menu;`;
    const [result] = await connection.execute(statement);
    return result;
  }
}

module.exports = new MenuService();
