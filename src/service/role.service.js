const connection = require("../app/database");

class RoleService {
  // 创建角色
  async create(roleName, menuIds, permissionIds) {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();
      const statement = `INSERT INTO admin_roles (role_name) VALUES (?);`;
      const [result] = await conn.execute(statement, [roleName]);
      const roleId = result.insertId;

      // 插入权限点
      for (const permissionId of permissionIds) {
        const permissionStatement = `INSERT INTO roles_permissions (roles_id, permissions_id) VALUES (?, ?);`;
        await conn.execute(permissionStatement, [roleId, permissionId]);
      }

      // 插入菜单
      for (const menuId of menuIds) {
        const menuStatement = `INSERT INTO roles_menu (roles_id, menu_id) VALUES (?, ?);`;
        await conn.execute(menuStatement, [roleId, menuId]);
      }

      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // 获取角色详情
  async getRoleById(id) {
    const statement = `
      WITH Permissions AS (
        SELECT roles_id, JSON_ARRAYAGG(permissions_id) AS permissionIds
        FROM roles_permissions
        GROUP BY roles_id
      ),
      Menus AS (
        SELECT roles_id, JSON_ARRAYAGG(menu_id) AS menuIds
        FROM roles_menu
        GROUP BY roles_id
      )
      SELECT 
        ar.id, 
        ar.role_name AS roleName, 
        COALESCE(p.permissionIds, JSON_ARRAY()) AS permissionIds,
        COALESCE(m.menuIds, JSON_ARRAY()) AS menuIds
      FROM  
        admin_roles ar
      LEFT JOIN 
        Permissions p ON ar.id = p.roles_id
      LEFT JOIN 
        Menus m ON ar.id = m.roles_id
      WHERE 
        ar.id = ?;
    `;
    const [result] = await connection.execute(statement, [id]);
    return result[0];
  }

  // 删除角色
  async remove(id) {
    const statement = `DELETE FROM admin_roles WHERE id = ?;`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }

  // 修改角色
  async update(id, roleName, menuIds, permissionIds) {
    const deletePermissionsStatement = `DELETE FROM roles_permissions WHERE roles_id = ?;`;
    const deleteMenusStatement = `DELETE FROM roles_menu WHERE roles_id = ?;`;
    const updateRoleStatement = `UPDATE admin_roles SET role_name = ? WHERE id = ?;`;
    const insertPermissionsStatement = `INSERT INTO roles_permissions (roles_id, permissions_id) VALUES (?, ?);`;
    const insertMenusStatement = `INSERT INTO roles_menu (roles_id, menu_id) VALUES (?, ?);`;

    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute(deletePermissionsStatement, [id]);
      await conn.execute(deleteMenusStatement, [id]);
      const [result] = await conn.execute(updateRoleStatement, [roleName, id]);

      for (const permissionId of permissionIds) {
        await conn.execute(insertPermissionsStatement, [id, permissionId]);
      }

      for (const menuId of menuIds) {
        await conn.execute(insertMenusStatement, [id, menuId]);
      }

      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // 查询所有角色及其权限和菜单
  async getAllRoles() {
    const statement = `
      SELECT 
        ar.id, ar.role_name roleName, ar.created_at createdAt, ar.updated_at updatedAt,
        GROUP_CONCAT(DISTINCT ap.permission_name SEPARATOR '、') AS permissionsDesc,
        GROUP_CONCAT(DISTINCT am.menu_name SEPARATOR '、') AS menusDesc
      FROM 
        admin_roles ar
      LEFT JOIN 
        roles_permissions rp ON ar.id = rp.roles_id
      LEFT JOIN 
        admin_permissions ap ON rp.permissions_id = ap.id
      LEFT JOIN 
        roles_menu rm ON ar.id = rm.roles_id
      LEFT JOIN 
        admin_menu am ON rm.menu_id = am.id
      GROUP BY 
        ar.id;
    `;
    const [result] = await connection.execute(statement);
    return result;
  }

  // 查询是否有该角色
  async getRoleByName(roleName) {
    const statement = `SELECT * FROM admin_roles WHERE role_name = ?;`;
    const [result] = await connection.execute(statement, [roleName]);
    return result.length > 0;
  }
}

module.exports = new RoleService();
