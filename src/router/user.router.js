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

// 查询所有用户接口
userRouter.post("/", verifyAuth, userController.list);

// 查询用户详情接口
userRouter.get("/:id", verifyAuth, userController.detail);

// 更新用户信息接口
userRouter.patch("/:id", verifyAuth, handlePassword, userController.update);

// 删除用户接口
userRouter.delete("/:id", verifyAuth, userController.delete);

module.exports = userRouter;
