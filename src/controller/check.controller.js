const ERROR_TYPE = require("../config/error");
const CheckService = require("../service/check.service");
const stallService = require("../service/stall.service");
const reservationService = require("../service/reservation.service");
const noticeController = require("./notice.controller");

class CheckController {
  async list(ctx) {
    try {
      const result = await CheckService.list();
      ctx.app.emit("list", ctx, result, result.length);
    } catch (error) {
      console.error("获取打卡列表失败:", error);
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
  async create(ctx) {
    try {
      const { userId, stallId, content, starLevel, reservationId } =
        ctx.request.body;
      const result = await CheckService.createCheck(
        userId,
        stallId,
        content,
        starLevel
      );
      // 更新摊位平均星
      await stallService.updateStallAverageStar(stallId);
      // 修改预约记录状态
      await reservationService.auditReservation(reservationId, "3");
      // 发送通知
      await noticeController.sendReservationNotice(reservationId, "3", content);
      ctx.app.emit("success", ctx, result, "提交打卡成功");
    } catch (error) {
      console.error("提交打卡失败:", error);
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  async record(ctx) {
    try {
      const { stallName, username } = ctx.request.body;
      const result = await CheckService.record(stallName, username);
      ctx.app.emit("list", ctx, result, result.length);
    } catch (error) {
      console.error("获取打卡记录失败:", error);
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new CheckController();
