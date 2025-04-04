const ERROR_TYPE = require("../config/error");
const visitService = require("../service/visit.service");
const stallService = require("../service/stall.service");
const stallUserService = require("../service/stall_user.service");
const paymentService = require("../service/payment.service");
class DataController {
  async getAdminData(ctx) {
    try {
      // 获取访问量
      const visit = await visitService.getVisitTotal();
      // 获取总摊位数
      const stallNum = await stallService.getStallTotal();
      // 获取总用户数
      const userNum = await stallUserService.getUserTotal();
      // 获取总流水
      const payment = await paymentService.getPaymentTotal();
      // 获取流水折线图数据
      const paymentLine = await paymentService.getPaymentLine();
      // 获取访问量信息
      const visitInfo = await visitService.getVisitInfo();
      // 获取访问量折线图数据
      const visitLine = await visitService.getVisitLine();
      ctx.app.emit("success", ctx, {
        visit,
        stallNum,
        userNum,
        payment: Number(payment),
        visitInfo,
        visitLine,
        paymentLine,
      });
    } catch (error) {
      ctx.app.emit("error", ctx, ERROR_TYPE.SERVER_ERROR);
    }
  }

  async getMobileData(ctx) {
    try {
      const { stallId } = ctx.params;
      // 获取摊位信息
      const stallInfo = await stallService.getStallDetail(stallId);
      // 获取摊位访问量
      const visit = await visitService.getStallVisitTotal(stallId);
      // 获取摊位流水
      const payment = await paymentService.getStallPaymentTotal(stallId);
      // 获取摊位总订单数
      const order = await paymentService.getStallOrderTotal(stallId);
      // 获取摊位折线图数据
      const paymentLine = await paymentService.getStallPaymentLine(stallId);
      ctx.app.emit("success", ctx, {
        stallInfo,
        visit,
        payment: Number(payment),
        order,
        paymentLine,
      });
    } catch (error) {
      console.log(error);
      ctx.app.emit("error", ctx, ERROR_TYPE.SERVER_ERROR);
    }
  }
}

module.exports = new DataController();
