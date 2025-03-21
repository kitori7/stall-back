const KoaRouter = require("@koa/router");
const {
  getAutoAuditStatus,
  setAutoAuditStatus,
} = require("../controller/config.controller");

const configRouter = new KoaRouter({
  prefix: "/config",
});

// 获取自动审核开关状态
configRouter.get("/getAuditStatus", getAutoAuditStatus);

// 设置自动审核开关状态
configRouter.post("/setAuditStatus", setAutoAuditStatus);

module.exports = configRouter;
