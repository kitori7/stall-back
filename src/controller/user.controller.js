const UserService = require("../service/user.service");

class UserController {
  async create(ctx) {
    const result = await UserService.create(ctx.request.body);
    ctx.body = {
      code: 200,
      data: result,
      message: "用户注册成功",
    };
  }
}

module.exports = new UserController();
