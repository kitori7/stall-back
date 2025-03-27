const connection = require("../app/database");
const reservationService = require("./reservation.service");

class CheckService {
  async list() {
    const sql = `SELECT
    r.id as reservationId,
    l.id as id,
    r.stall_id stallId,
    r.status status,
    r.created_at createdAt,
    s.stall_name stallName,
    s.owner_phone_number stallPhone,
    s.owner_name stallOwnerName,
    s.average_star stallAverageStar,
    l.location_name locationName,
    l.coordinates coordinates
    FROM reservation r
    LEFT JOIN stall s ON r.stall_id = s.id
    LEFT JOIN location l ON r.location_id = l.id
    WHERE r.status = '2' AND DATE(r.date) = CURDATE()`;
    const [result] = await connection.execute(sql);
    return result;
  }
  async createCheck(userId, stallId, content, starLevel) {
    const check = await connection.execute(
      "INSERT INTO `check` (user_id, stall_id, content, star_level) VALUES (?, ?, ?, ?)",
      [userId, stallId, content, starLevel]
    );
    return check;
  }

  async record(stallName, username) {
    let sql = `
SELECT 
    c.id,
    c.created_at AS createdAt,
    c.star_level AS starLevel,
    c.content,
    c.stall_id AS stallId,
    su.username as username,
    s.stall_name as stallName,
    s.owner_phone_number as stallPhone,
    s.owner_name as stallOwnerName
FROM 
    \`check\` c
LEFT JOIN 
    stall_user su ON c.user_id = su.id
LEFT JOIN
    stall s ON c.stall_id = s.id
WHERE 1=1`;

    const params = [];

    if (stallName) {
      sql += ` AND s.stall_name LIKE ?`;
      params.push(`%${stallName}%`);
    }

    if (username) {
      sql += ` AND su.username LIKE ?`;
      params.push(`%${username}%`);
    }

    sql += ` ORDER BY c.created_at DESC`;

    const [result] = await connection.execute(sql, params);
    return result;
  }
}

module.exports = new CheckService();
