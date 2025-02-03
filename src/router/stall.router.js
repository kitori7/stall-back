const KoaRouter = require("@koa/router");
const {
  create,
  update,
  list,
  detail,
  timeline,
  audit,
  reject,
  disable,
  mobileList,
} = require("../controller/stall.controller");
const { verifyAuth, handlePassword } = require("../middleware/user.middleware");

const stallRouter = new KoaRouter({
  prefix: "/stall",
});

// 创建摊位
stallRouter.post("/", handlePassword, create);

// 更新摊位
stallRouter.patch("/:id", update);

// 获取摊位详情
stallRouter.get("/:id", detail);

// 获取摊位列表
stallRouter.post("/list", verifyAuth, list);

// 获取审核时间线
stallRouter.get("/timeline/:id", timeline);

// 禁用摊位
stallRouter.post("/disable/:id", disable);
// 摊位审核通过
stallRouter.post("/audit/:id", audit);

// 摊位审核驳回
stallRouter.post("/reject/:id", reject);

// 移动端获取摊位列表
stallRouter.post("/mobile/list", verifyAuth, mobileList);

module.exports = stallRouter;
