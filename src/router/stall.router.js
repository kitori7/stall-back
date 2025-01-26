const KoaRouter = require("@koa/router");
const {
  create,
  update,
  list,
  detail,
  timeline,
} = require("../controller/stall.controller");
const { verifyAuth, handlePassword } = require("../middleware/user.middleware");

const stallRouter = new KoaRouter({
  prefix: "/stall",
});

// 创建摊位
stallRouter.post("/", handlePassword, create);

// 更新摊位
stallRouter.patch("/:id", verifyAuth, update);

// 获取摊位详情
stallRouter.get("/:id", verifyAuth, detail);

// 获取摊位列表
stallRouter.get("/", verifyAuth, list);

// 获取审核时间线
stallRouter.get("/timeline/:id", timeline);

module.exports = stallRouter;
