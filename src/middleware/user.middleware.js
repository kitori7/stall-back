const UserService = require("../service/user.service");
const ERROR_TYPE = require("../config/error");
const md5password = require("../utils/md5-password");
const jwt = require("jsonwebtoken");
const { PUBLIC_KEY } = require("../config/secret");
const StallUserService = require("../service/stall_user.service");
const verifyUser = (type) => {
  return async (ctx, next) => {
    const { username, password } = ctx.request.body;

    // 判断用户是否为空
    if (!username || !password) {
      return ctx.app.emit(
        "error",
        ERROR_TYPE.NAME_OR_PASSWORD_IS_REQUIRED,
        ctx
      );
    }

    // 注册判断用户是否存在
    const user = await UserService.getUserByUsername(username);
    if (type === "REGISTER") {
      if (user.length > 0) {
        return ctx.app.emit("error", ERROR_TYPE.USER_ALREADY_EXISTS, ctx);
      }
    }

    // 登录判断用户是否存在
    if (type === "LOGIN") {
      if (user.length === 0) {
        return ctx.app.emit("error", ERROR_TYPE.USER_DOES_NOT_EXIST, ctx);
      }
    }
    await next();
  };
};

// 加密密码
const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  if (password) {
    ctx.request.body.password = md5password(password);
  }
  await next();
};

// 登录验证
const verifyPassword = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const user = await UserService.getUserByUsername(username);
  if (user[0].password !== md5password(password)) {
    return ctx.app.emit("error", ERROR_TYPE.PASSWORD_IS_INCORRECT, ctx);
  }
  // 将用户信息保存到ctx中
  ctx.user = user[0];
  await next();
};

// 验证token
const verifyAuth = async (ctx, next) => {
  if (!ctx.headers.authorization) {
    return ctx.app.emit("error", ERROR_TYPE.UNAUTHORIZED, ctx);
  }
  const token = ctx.headers.authorization.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = decoded;
    await next();
  } catch (error) {
    return ctx.app.emit("error", ERROR_TYPE.UNAUTHORIZED, ctx);
  }
};

const verifyStallUser = (type) => {
  return async (ctx, next) => {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      return ctx.app.emit(
        "error",
        ERROR_TYPE.NAME_OR_PASSWORD_IS_REQUIRED,
        ctx
      );
    }
    // 注册判断用户是否存在
    const user = await StallUserService.getUserByUserName(username);

    if (type === "REGISTER") {
      if (user.length > 0) {
        return ctx.app.emit("error", ERROR_TYPE.USER_ALREADY_EXISTS, ctx);
      }
    }

    // 登录判断用户是否存在
    if (type === "LOGIN") {
      if (user.length === 0) {
        return ctx.app.emit("error", ERROR_TYPE.USER_DOES_NOT_EXIST, ctx);
      }
    }
    await next();
  };
};

const verifyStallUserLogin = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const user = await StallUserService.getUserByUserName(username);
  if (user[0].password !== md5password(password)) {
    return ctx.app.emit("error", ERROR_TYPE.PASSWORD_IS_INCORRECT, ctx);
  }
  ctx.user = user[0];
  await next();
};

module.exports = {
  verifyUser,
  handlePassword,
  verifyPassword,
  verifyAuth,
  verifyStallUser,
  verifyStallUserLogin,
};
