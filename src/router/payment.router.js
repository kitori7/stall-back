const KoaRouter = require("@koa/router");
const {
  create,
  getPaymentsByStallId,
} = require("../controller/payment.controller");

const paymentRouter = new KoaRouter({
  prefix: "/payment",
});

// 创建支付
paymentRouter.post("/", create);

// 根据摊位 id 获取所有支付记录
paymentRouter.get("/:stallId", getPaymentsByStallId);

module.exports = paymentRouter;
