const connection = require("../app/database");

class StallService {
  async createStall(
    userId,
    stallName,
    ownerName,
    ownerIdCard,
    ownerPhoneNumber,
    stallHeadImg,
    stallDetailImg,
    stallDesc,
    businessImg,
    foodSafetyImg,
    individualImg
  ) {
    try {
      const sql = `
      INSERT INTO stall (
        user_id,
        stall_name,
        owner_name,
        owner_id_number,
        owner_phone_number,
        stall_head_image,
        stall_detail_images,
        stall_description,
        business_license,
        food_safety_license,
        individual_business_license,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '0')
    `;
      const [result] = await connection.execute(sql, [
        userId,
        stallName,
        ownerName,
        ownerIdCard,
        ownerPhoneNumber,
        stallHeadImg,
        stallDetailImg,
        stallDesc,
        businessImg,
        foodSafetyImg,
        individualImg,
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async updateStall(id, stallData) {
    const sql = `
      UPDATE stall
      SET
        stall_name = ?,
        owner_name = ?,
        owner_id_number = ?,
        owner_phone_number = ?,
        stall_head_image = ?,
        stall_detail_images = ?,
        stall_description = ?,
        business_license = ?,
        food_safety_license = ?,
        individual_business_license = ?,
        status = ?
      WHERE id = ?
    `;
    const [result] = await connection.execute(sql, [
      stallData.stallName,
      stallData.ownerName,
      stallData.ownerIdCard,
      stallData.ownerPhoneNumber,
      stallData.stallHeadImg,
      JSON.stringify(stallData.stallDetailImg),
      stallData.stallDesc,
      stallData.businessImg,
      stallData.foodSafetyImg,
      stallData.individualImg,
      stallData.status,
      id,
    ]);
    return result;
  }

  async getStallDetail(id) {
    try {
      const sql = `
      SELECT
        su.username AS userName,
        su.password,
        su.phone_number AS phoneNumber,
        stall.id AS id,
        stall.stall_name AS stallName,
        stall.owner_name AS ownerName,
        stall.owner_id_number AS ownerIdCard,
        stall.owner_phone_number AS ownerPhoneNumber,
        stall.stall_head_image AS stallHeadImg,
        stall.stall_detail_images AS stallDetailImg,
        stall.stall_description AS stallDesc,
        stall.business_license AS businessImg,
        stall.food_safety_license AS foodSafetyImg,
        stall.individual_business_license AS individualImg,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', se.id,
            'name', se.name,
            'phoneNumber', se.phone_number,
            'idCard', se.id_number,
            'healthImg', se.health_certificate
          )
        ) AS employees
      FROM stall
      LEFT JOIN stall_user su ON stall.user_id = su.id
      LEFT JOIN stall_employees se ON se.stall_id = stall.id
      WHERE stall.id = ?
      GROUP BY stall.id
    `;
      const [result] = await connection.execute(sql, [id]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  // 返回 userId 的 stallState
  async getStallState(userId) {
    const sql = `
      SELECT status FROM stall WHERE user_id = ?
    `;
    const [result] = await connection.execute(sql, [userId]);
    return result[0];
  }

  async getAllStalls(
    offset,
    pageSize,
    stallName,
    ownerName,
    ownerPhoneNumber,
    status
  ) {
    try {
      let sql = `
        SELECT s.id,
         s.stall_name stallName,
         s.stall_description stallDesc,
         s.owner_name ownerName,
         s.owner_phone_number ownerPhoneNumber,
         s.status,
         s.created_at createdAt,
         s.updated_at updatedAt
        FROM stall s
        WHERE 1=1
      `;
      const params = [];

      if (stallName) {
        sql += " AND s.stall_name LIKE ?";
        params.push(`%${stallName}%`);
      }

      if (ownerName) {
        sql += " AND s.owner_name LIKE ?";
        params.push(`%${ownerName}%`);
      }

      if (ownerPhoneNumber) {
        sql += " AND s.owner_phone_number LIKE ?";
        params.push(`%${ownerPhoneNumber}%`);
      }

      if (status) {
        sql += " AND s.status = ?";
        params.push(status);
      }

      // 添加排序条件：待审核(0) > 已驳回(2) > 已通过(1) > 已禁用(3)
      sql += ` ORDER BY 
        CASE 
          WHEN s.status = '0' THEN 0
          WHEN s.status = '2' THEN 1
          WHEN s.status = '1' THEN 2
          WHEN s.status = '3' THEN 3
          ELSE 4
        END`;

      if (offset && pageSize) {
        sql += " LIMIT ?, ?";
        params.push(Number(offset), Number(pageSize));
      }

      const [result] = await connection.execute(sql, [...params]);
      return result;
    } catch (error) {
      return [];
    }
  }

  async editStallStatus(id, status) {
    const sql = `UPDATE stall SET status = ? WHERE id = ?`;
    const [result] = await connection.execute(sql, [status, id]);
    return result;
  }
}

module.exports = new StallService();
