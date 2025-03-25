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
    try {
      const sql = `
        WITH Permissions AS (
          SELECT rp.roles_id, JSON_ARRAYAGG(JSON_OBJECT('permissionName', ap.permission_name, 'permissionCode', ap.permission_code)) AS permissions
          FROM roles_permissions rp
          LEFT JOIN admin_permissions ap ON rp.permissions_id = ap.id
          GROUP BY rp.roles_id
        ),
        Menus AS (
          SELECT rm.roles_id, JSON_ARRAYAGG(JSON_OBJECT('menuName', am.menu_name, 'routeName', am.route_name)) AS menus
          FROM roles_menu rm
          LEFT JOIN admin_menu am ON rm.menu_id = am.id
          GROUP BY rm.roles_id
        )
        SELECT 
          au.id, 
          au.username, 
          au.roles_id AS rolesId,
          COALESCE(p.permissions, JSON_OBJECT()) AS permissions,
          COALESCE(m.menus, JSON_OBJECT()) AS menus
        FROM 
          admin_user au
        LEFT JOIN 
          Permissions p ON au.roles_id = p.roles_id
        LEFT JOIN 
          Menus m ON au.roles_id = m.roles_id
        WHERE 
          au.id = ?;
`;
      const [result] = await connection.execute(sql, [id]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(id, userInfo) {
    try {
      const { rolesId, password } = userInfo;
      let sql = "UPDATE admin_user SET ";
      const params = [];

      if (rolesId) {
        sql += "roles_id = ?";
        params.push(rolesId);
      }

      if (password) {
        if (params.length > 0) {
          sql += ", ";
        }
        sql += "password = ?";
        params.push(password);
      }

      if (id) {
        sql += " WHERE id = ?";
        params.push(id);
      }

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

  // stall用户
  async createStallUser(username, password, phoneNumber, roleType) {
    const sql =
      "INSERT INTO `stall_user` (username, password, phone_number, role_type) VALUES (?, ?, ?, ?)";
    const [result] = await connection.execute(sql, [
      username,
      password,
      phoneNumber,
      roleType,
    ]);
    return result;
  }

  async queryUser(username, password) {
    const sql = "SELECT * FROM admin_user WHERE username = ? AND password = ?";
    const [result] = await connection.execute(sql, [username, password]);
    return result;
  }
}

module.exports = new UserService();
