const paymentService = require("../service/payment.service");
const ERROR_TYPE = require("../config/error");

class PaymentController {
  async create(ctx) {
    try {
      const { amount, reservationId, stallId } = ctx.request.body;
      await paymentService.create(amount, reservationId, stallId);
      ctx.app.emit("success", ctx, true, "支付成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new PaymentController();
