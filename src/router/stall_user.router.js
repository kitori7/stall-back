const KoaRouter = require("@koa/router");
const stallUserController = require("../controller/stall_user.controller");
const {
  handlePassword,
  verifyStallUser,
  verifyStallUserLogin,
  verifyStallUserStatus,
} = require("../middleware/user.middleware");
const stallUserRouter = new KoaRouter({
  prefix: "/stall/user",
});

// 摊位用户注册接口
stallUserRouter.post(
  "/register",
  verifyStallUser("REGISTER"),
  handlePassword,
  stallUserController.register
);

// 摊位用户登录接口
stallUserRouter.post(
  "/login",
  verifyStallUser("LOGIN"),
  verifyStallUserLogin,
  verifyStallUserStatus,
  stallUserController.login
);

// 获取摊位用户信息
stallUserRouter.get("/:id", stallUserController.detail);

// 修改摊位用户头像
stallUserRouter.patch("/avatar/:id", stallUserController.updateAvatar);

module.exports = stallUserRouter;
