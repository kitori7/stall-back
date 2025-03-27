const paymentService = require("../service/payment.service");
const ERROR_TYPE = require("../config/error");
const stallService = require("../service/stall.service");
class PaymentController {
  async create(ctx) {
    try {
      const { amount, reservationId, stallId } = ctx.request.body;
      await paymentService.create(amount, reservationId, stallId);
      await stallService.updateTotalRevenue(stallId);
      ctx.app.emit("success", ctx, true, "支付成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  async getPaymentsByStallId(ctx) {
    try {
      const { stallId } = ctx.params;
      const payments = await paymentService.getPaymentsByStallId(stallId);
      ctx.app.emit("list", ctx, payments, payments.length);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new PaymentController();
