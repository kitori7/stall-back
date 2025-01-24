const jwt = require("jsonwebtoken");
const UserService = require("../service/user.service");
const { PRIVATE_KEY } = require("../config/secret");
class UserController {
  async create(ctx) {
    await UserService.create(ctx.request.body);
    ctx.app.emit("success", ctx, true, "用户注册成功");
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
  async list(ctx) {
    try {
      const {
        current = 1,
        pageSize = 10,
        username,
        rolesId,
      } = ctx.request.body;
      const offset = (current - 1) * pageSize;
      const result = await UserService.getAllUsers(
        offset,
        pageSize,
        username,
        rolesId
      );
      ctx.app.emit("list", ctx, result, result.length);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  async detail(ctx) {
    try {
      const { id } = ctx.params;
      const res = await UserService.getUserById(id);
      ctx.app.emit("success", ctx, res);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { rolesId, password } = ctx.request.body;
      console.log(id, rolesId, password);
      await UserService.updateUser(id, {
        rolesId,
        password,
      });
      ctx.app.emit("success", ctx, true, "更新用户信息成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  async delete(ctx) {
    const { id } = ctx.params;
    await UserService.deleteUser(id);
    ctx.app.emit("success", ctx, true, "删除用户成功");
  }
}

module.exports = new UserController();
