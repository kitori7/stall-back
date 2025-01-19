const jwt = require("jsonwebtoken");
const UserService = require("../service/user.service");
const { PRIVATE_KEY } = require("../config/screct");
class UserController {
  async create(ctx) {
    const result = await UserService.create(ctx.request.body);
    ctx.body = {
      code: 200,
      data: result,
      message: "用户注册成功",
    };
  }

  async login(ctx) {
    // 颁发令牌
    const { id, username } = ctx.user;
    const token = jwt.sign({ id, username }, PRIVATE_KEY, {
      expiresIn: "1h",
      algorithm: "RS256",
    });
    console.log(ctx.request.body);

    ctx.body = {
      code: 200,
      data: { token, id, username },
      message: "用户登录成功",
    };
  }
}

module.exports = new UserController();
