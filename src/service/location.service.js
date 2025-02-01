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
}

module.exports = new LocationService();
