const Router = require("@koa/router");
const { verifyAuth } = require("../middleware/user.middleware");
const {
  create,
  list,
  update,
  remove,
} = require("../controller/permission.controller");

const permissionRouter = new Router({ prefix: "/permission" });

// 创建权限
permissionRouter.post("/", verifyAuth, create);

// 获取权限列表
permissionRouter.get("/", verifyAuth, list);

// 更新权限
permissionRouter.patch("/:id", verifyAuth, update);

// 删除权限
permissionRouter.delete("/:id", verifyAuth, remove);

module.exports = permissionRouter;
