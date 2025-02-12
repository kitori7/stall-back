const KoaRouter = require("@koa/router");
const { create } = require("../controller/payment.controller");

const paymentRouter = new KoaRouter({
  prefix: "/payment",
});

// 创建支付
paymentRouter.post("/", create);

module.exports = paymentRouter;
