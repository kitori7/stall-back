const KoaRouter = require("@koa/router");
const {
  create,
  update,
  list,
  detail,
} = require("../controller/stall.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const stallRouter = new KoaRouter({
  prefix: "/stall",
});

// 创建摊位
stallRouter.post("/", create);

// 更新摊位
stallRouter.patch("/:id", verifyAuth, update);

// 获取摊位详情
stallRouter.get("/:id", verifyAuth, detail);

// 获取摊位列表
stallRouter.get("/", verifyAuth, list);

module.exports = stallRouter;
