const UserService = require("../service/user.service");
const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  USER_ALREADY_EXISTS,
} = require("../config/error");
const md5password = require("../utils/md5-password");

const verifyUser = async (ctx, next) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    return ctx.app.emit("error", NAME_OR_PASSWORD_IS_REQUIRED, ctx);
  }

  // 判断用户是否存在
  const user = await UserService.getUserByUsername(username);
  if (user.length > 0) {
    return ctx.app.emit("error", USER_ALREADY_EXISTS, ctx);
  }

  await next();
};

const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  ctx.request.body.password = md5password(password);
  await next();
};

module.exports = {
  verifyUser,
  handlePassword,
};
