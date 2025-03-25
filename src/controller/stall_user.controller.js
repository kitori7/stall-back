const StallUserService = require("../service/stall_user.service");
const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config/secret");
const StallService = require("../service/stall.service");
const userService = require("../service/user.service");
const ERROR_TYPE = require("../config/error");
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
      await StallUserService.updateAvatar(id, avatar);
      ctx.app.emit("success", ctx, true, "更新用户头像成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  async registerAdmin(ctx) {
    try {
      const { username, password } = ctx.request.body;

      // 验证用户名和密码
      if (!username || !password) {
        return ctx.app.emit(
          "error",
          ERROR_TYPE.NAME_OR_PASSWORD_IS_REQUIRED,
          ctx
        );
      }

      // 查询用户
      const result = await userService.queryUser(username, password);

      // 检查用户是否存在
      if (!result || result.length === 0) {
        return ctx.app.emit("error", ERROR_TYPE.USER_DOES_NOT_EXIST, ctx);
      }

      // 获取用户详细信息
      const user = await userService.getUserById(result[0].id);

      // 检查用户权限
      const hasPermission =
        user &&
        user.permissions &&
        Array.isArray(user.permissions) &&
        user.permissions.some((item) => item.permissionCode === "H5_USER");

      if (hasPermission) {
        await StallUserService.createUser(username, password, 111, "3");
        // 注册成功
        return ctx.app.emit("success", ctx, true, "注册成功");
      } else {
        // 用户没有权限
        return ctx.app.emit("error", ERROR_TYPE.USER_PERMISSION_NOT_EXIST, ctx);
      }
    } catch (error) {
      return ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new StallUserController();
