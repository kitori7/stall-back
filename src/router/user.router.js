const KoaRouter = require("@koa/router");
const userController = require("../controller/user.controller");
const {
  verifyUser,
  handlePassword,
  verifyPassword,
  verifyAuth,
} = require("../middleware/user.middleware");
const userRouter = new KoaRouter({
  prefix: "/user",
});

// 后台用户注册接口
userRouter.post(
  "/register",
  verifyUser("REGISTER"),
  handlePassword,
  userController.create
);

// 后台用户登录接口
userRouter.post(
  "/login",
  verifyUser("LOGIN"),
  verifyPassword,
  userController.login
);

// 验证token
userRouter.get("/test", verifyAuth, userController.test);

module.exports = userRouter;
