const KoaRouter = require("@koa/router");
const { create, list, record } = require("../controller/check.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const checkRouter = new KoaRouter({
  prefix: "/check",
});

// 获取打卡列表
checkRouter.get("/list", verifyAuth, list);

// 提交打卡
checkRouter.post("/", verifyAuth, create);

//获取所有打卡记录
checkRouter.post("/record", verifyAuth, record);

module.exports = checkRouter;
