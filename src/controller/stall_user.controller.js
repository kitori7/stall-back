const StallUserService = require("../service/stall_user.service");
const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config/secret");
const StallService = require("../service/stall.service");

class StallUserController {
  async register(ctx) {
    const { username, password, phoneNumber, roleType } = ctx.request.body;
    await StallUserService.createUser(
      username,
      password,
      phoneNumber,
      roleType
    );
    ctx.app.emit("success", ctx, true, "注册成功");
  }

  async login(ctx) {
    // 颁发令牌
    const { id, username } = ctx.user;
    const token = jwt.sign({ id, username }, PRIVATE_KEY, {
      expiresIn: "1d",
      algorithm: "RS256",
    });
    const user = await StallUserService.getUserByUserName(username);
    const stall = await StallService.getStallByUserId(id);
    ctx.app.emit(
      "success",
      ctx,
      {
        userInfo: {
          id: user[0].id,
          avatar: user[0].avatar,
          username: user[0].username,
          phoneNumber: user[0].phone_number,
          roleType: user[0].role_type,
          stallId: stall ? stall.id : null,
        },
        token,
      },
      "登录成功"
    );
  }

  async detail(ctx) {
    const { id } = ctx.params;
    const result = await StallUserService.getUserById(id);
    ctx.app.emit("success", ctx, result);
  }

  async updateAvatar(ctx) {
    try {
      const { id } = ctx.params;
      const { avatar } = ctx.request.body;
      console.log(avatar);
      await StallUserService.updateAvatar(id, avatar);
      ctx.app.emit("success", ctx, true, "更新用户头像成功");
    } catch (error) {
      console.log(error);
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new StallUserController();
