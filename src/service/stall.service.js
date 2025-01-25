const connection = require("../app/database");

class StallService {
  async createStall(
    userName,
    password,
    phoneNumber,
    stallName,
    ownerName,
    ownerId,
    ownerPhoneNumber,
    stallHeadImg,
    stallDetailImg,
    stallDesc,
    businessImg,
    foodSafetyImg,
    individualImg
  ) {
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
      userName,
      stallName,
      ownerName,
      ownerId,
      ownerPhoneNumber,
      stallHeadImg,
      JSON.stringify(stallDetailImg),
      stallDesc,
      businessImg,
      foodSafetyImg,
      individualImg,
    ]);
    return result;
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
      stallData.ownerId,
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
    const sql = `
      SELECT * FROM stall WHERE id = ?
    `;
    const [result] = await connection.execute(sql, [id]);
    return result[0];
  }

  async getStallList() {
    const sql = `
      SELECT * FROM stall
    `;
    const [result] = await connection.execute(sql);
    return result;
  }
}

module.exports = new StallService();
