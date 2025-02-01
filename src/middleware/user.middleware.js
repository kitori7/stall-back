const UserService = require("../service/user.service");
const ERROR_TYPE = require("../config/error");
const md5password = require("../utils/md5-password");
const jwt = require("jsonwebtoken");
const { PUBLIC_KEY } = require("../config/secret");
const StallUserService = require("../service/stall_user.service");
const stallService = require("../service/stall.service");
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
    console.log(error);
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
  try {
    const { username, password } = ctx.request.body;
    const user = await StallUserService.getUserByUserName(username);
    if (user[0].password !== md5password(password)) {
      return ctx.app.emit("error", ERROR_TYPE.PASSWORD_IS_INCORRECT, ctx);
    }
    ctx.user = user[0];
    await next();
  } catch (error) {
    return ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

// 判断用户的stall 是否状态为已通过
const verifyStallUserStatus = async (ctx, next) => {
  console.log(ctx.user);

  const { id, role_type } = ctx.user;
  // 如果用户是摊主, 则需要判断摊位状态
  if (role_type === "1") {
    const stateInfo = await stallService.getStallState(id);
    if (stateInfo.status === "3") {
      return ctx.app.emit("error", ERROR_TYPE.STALL_STATUS_DISABLE, ctx);
    }
    if (stateInfo.status !== "1") {
      return ctx.app.emit("error", ERROR_TYPE.USER_STATUS_NOT_PASSED, ctx);
    }
  }

  await next();
};

module.exports = {
  verifyUser,
  handlePassword,
  verifyPassword,
  verifyAuth,
  verifyStallUser,
  verifyStallUserLogin,
  verifyStallUserStatus,
};
