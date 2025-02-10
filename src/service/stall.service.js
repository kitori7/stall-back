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
        stall.average_rating AS averageRating,
        stall.total_ratings AS totalRatings,
        (SELECT JSON_OBJECT(
            'reservationId', r.id,
            'times', r.times,
            'date', r.date
         ) 
         FROM reservation r 
         WHERE r.stall_id = stall.id 
         ORDER BY ABS(DATEDIFF(r.date, CURDATE())) 
         LIMIT 1) AS reservationInfo,
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

  async getStallByUserId(userId) {
    const sql = `
      SELECT * FROM stall WHERE user_id = ?
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

  async getMobileStallList(offset, pageSize, stallName) {
    let sql = `
      SELECT 
        s.id,
        s.stall_name AS stallName,
        s.stall_description AS stallDesc,
        s.stall_head_image AS stallHeadImg,
        s.status,
        s.average_rating AS averageRating,
        r.times,
        r.date,
        (SELECT l.coordinates FROM location l WHERE l.id = r.location_id) AS coordinates
      FROM stall s
      LEFT JOIN reservation r ON s.id = r.stall_id
      WHERE s.status = '1'
    `;
    const params = [];
    if (stallName) {
      sql += ` AND s.stall_name LIKE ?`;
      params.push(`%${stallName}%`);
    }
    sql += ` GROUP BY s.id`;
    sql += ` ORDER BY ABS(DATEDIFF(r.date, CURDATE()))`;
    if (offset && pageSize) {
      sql += ` LIMIT ?, ?`;
      params.push(Number(offset), Number(pageSize));
    }
    try {
      const [result] = await connection.execute(sql, params);
      return result;
    } catch (error) {
      console.error("获取移动端摊位列表失败:", error);
      return [];
    }
  }

  // 更新摊位平均分
  async updateStallAverageScore(stallId) {
    const sql = `UPDATE stall 
      SET 
        total_ratings = (SELECT COUNT(*) FROM stall_comment WHERE stall_id = ?),
        average_rating = (SELECT AVG(rating) FROM stall_comment WHERE stall_id = ?)
      WHERE id = ?;`;
    const [result] = await connection.execute(sql, [stallId, stallId, stallId]);
    return result;
  }

  // 更新总营收
  async updateTotalRevenue(stallId) {
    const sql = `UPDATE stall 
      SET total_revenue = (SELECT SUM(amount) FROM stall_payment WHERE stall_id = ?)
      WHERE id = ?;`;
    const [result] = await connection.execute(sql, [stallId, stallId]);
    return result;
  }
  // 更新总访问量
  async updateTotalVisit(stallId) {
    const sql = `UPDATE stall 
      SET total_visits = (SELECT COUNT(*) FROM stall_visit WHERE stall_id = ?)
      WHERE id = ?;`;
    const [result] = await connection.execute(sql, [stallId, stallId]);
    return result;
  }

  async getStallTotal() {
    const sql = `SELECT COUNT(*) FROM stall`;
    const [result] = await connection.execute(sql);
    return result[0]["COUNT(*)"];
  }
}

module.exports = new StallService();
