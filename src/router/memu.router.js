const KoaRouter = require("@koa/router");
const {
  create,
  update,
  remove,
  list,
} = require("../controller/menu.controller");
const { verifyAuth } = require("../middleware/user.middleware");
const menuRouter = new KoaRouter({
  prefix: "/menu",
});

// 创建菜单
menuRouter.post("/", verifyAuth, create);

// 更新菜单
menuRouter.patch("/:id", verifyAuth, update);

// 删除菜单
menuRouter.delete("/:id", verifyAuth, remove);

// 获取菜单列表
menuRouter.get("/", list);

module.exports = menuRouter;
