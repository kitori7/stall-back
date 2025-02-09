const KoaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/user.middleware");
const { create } = require("../controller/payment.controller");

const paymentRouter = new KoaRouter({
  prefix: "/payment",
});

// 创建支付
paymentRouter.post("/", verifyAuth, create);

module.exports = paymentRouter;
