const crypto = require("crypto");

function md5password(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

module.exports = md5password;
