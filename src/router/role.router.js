const KoaRouter = require("@koa/router");
const {
  create,
  update,
  remove,
  list,
  detail,
} = require("../controller/role.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const roleRouter = new KoaRouter({
  prefix: "/role",
});

// 创建角色
roleRouter.post("/", verifyAuth, create);

// 更新角色
roleRouter.patch("/:id", verifyAuth, update);

// 删除角色
roleRouter.delete("/:id", verifyAuth, remove);

// 获取角色详情
roleRouter.get("/:id", verifyAuth, detail);

// 获取角色列表
roleRouter.get("/", verifyAuth, list);

module.exports = roleRouter;
