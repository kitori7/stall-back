const KoaRouter = require("@koa/router");
const userController = require("../controller/user.controller");
const {
  verifyUser,
  handlePassword,
  verifyPassword,
} = require("../middleware/user.middleware");
const userRouter = new KoaRouter({
  prefix: "/user",
});

// 后台用户注册接口
userRouter.post(
  "/register",
  async (ctx, next) => {
    await verifyUser("REGISTER", ctx, next);
  },
  handlePassword,
  userController.create
);

// 后台用户登录接口
userRouter.post(
  "/login",
  async (ctx, next) => {
    await verifyUser("LOGIN", ctx, next);
  },
  verifyPassword,
  userController.login
);

module.exports = userRouter;
