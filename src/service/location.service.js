const connection = require("../app/database");

class LocationService {
  async create(locationName, availableWeekdays, availableTime, coordinates) {
    const statement = `INSERT INTO location 
    (location_name, available_weekdays, available_time, coordinates) 
    VALUES (?, ?, ?, ?);`;
    const [result] = await connection.execute(statement, [
      locationName,
      availableWeekdays,
      availableTime,
      coordinates,
    ]);
    return result;
  }

  async update(id, { locationName, availableWeekdays, availableTime }) {
    const statement = `UPDATE location SET location_name = ?,
     available_weekdays = ?,
     available_time = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [
      locationName,
      availableWeekdays,
      availableTime,
      id,
    ]);
    return result;
  }

  async detail(id) {
    const statement = `SELECT id, location_name locationName,
     available_weekdays availableWeekdays,
     available_time availableTime,
     coordinates FROM location WHERE id = ?;`;
    const [result] = await connection.execute(statement, [id]);
    return result[0];
  }

  async list(offset, pageSize, locationName) {
    let statement = `SELECT id, location_name locationName,
     available_weekdays availableWeekdays,
     available_time availableTime,
      coordinates FROM location`;
    const params = [];

    if (locationName) {
      statement += ` WHERE location_name LIKE ?`;
      params.push(`%${locationName}%`);
    }

    if (offset && pageSize) {
      statement += ` LIMIT ?, ?`;
      params.push(offset, pageSize);
    }

    const [result] = await connection.execute(statement, params);
    return result;
  }

  async remove(id) {
    const statement = `DELETE FROM location WHERE id = ?;`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }

  async getLocationName(locationName) {
    const statement = `SELECT id FROM location WHERE location_name = ?;`;
    const [result] = await connection.execute(statement, [locationName]);
    return result;
  }

  // 根据位置id获取最近预约数据
  async getReservation(id) {
    const statement = `SELECT 
    l.id locationId,
    r.id reservationId,
    s.stall_name stallName,
    s.id stallId,
    s.owner_phone_number ownerPhoneNumber,
    s.owner_name ownerName,
    l.location_name locationName,
    r.times,
    SUM(sp.amount) amount,
    COUNT(sv.id) visitCount,
    r.date date
    FROM location l
    LEFT JOIN reservation r ON l.id = r.location_id
    LEFT JOIN stall s ON r.stall_id = s.id
    LEFT JOIN stall_visit sv ON r.id = sv.reservation_id
    LEFT JOIN stall_payment sp ON r.id = sp.reservation_id
    WHERE l.id = ? ;
    `;
    const [result] = await connection.execute(statement, [id]);
    return result[0];
  }

  // 根据位置id获取当前预约数据
  async getReservationNow(id) {
    const statement = `SELECT 
    l.id locationId,
    r.id reservationId,
    s.stall_name stallName,
    s.id stallId,
    s.owner_phone_number ownerPhoneNumber,
    s.owner_name ownerName,
    l.location_name locationName,
    r.times,
    SUM(sp.amount) amount,
    COUNT(sv.id) visitCount,
    r.date date
    FROM location l
    LEFT JOIN reservation r ON l.id = r.location_id
    LEFT JOIN stall s ON r.stall_id = s.id
    LEFT JOIN stall_visit sv ON r.id = sv.reservation_id
    LEFT JOIN stall_payment sp ON r.id = sp.reservation_id
    WHERE l.id = ? AND DATE(r.date) = CURDATE();
    `;
    const [result] = await connection.execute(statement, [id]);
    return result[0];
  }
}

module.exports = new LocationService();
