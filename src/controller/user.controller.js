const jwt = require("jsonwebtoken");
const UserService = require("../service/user.service");
const { PRIVATE_KEY } = require("../config/secret");
class UserController {
  async create(ctx) {
    const data = await UserService.create(ctx.request.body);
    ctx.app.emit("success", ctx, data, "用户注册成功");
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

    ctx.app.emit("success", ctx, { token, id, username }, "用户登录成功");
  }

  async test(ctx) {
    ctx.app.emit("success", ctx, true, "用户登录成功");
  }
}

module.exports = new UserController();
