const ERROR_TYPE = require("../config/error");
const ReservationService = require("../service/reservation.service");
const noticeController = require("./notice.controller");

class ReservationController {
  // 创建预约
  async create(ctx) {
    try {
      const { date, times, locationId, stallId } = ctx.request.body;
      const res = await ReservationService.create(
        date,
        times,
        locationId,
        stallId
      );
      await noticeController.sendReservationNotice(res.insertId, "0");
      ctx.app.emit("success", ctx, true, "预约创建成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 获取当天预约时段
  async getReservationTime(ctx) {
    const { date, locationId } = ctx.request.query;
    const reservationTime = await ReservationService.getReservationTime(
      date,
      locationId
    );
    ctx.app.emit("success", ctx, reservationTime);
  }

  // 根据摊位 id 获取预约列表
  async getReservationListByStallId(ctx) {
    const { stallId } = ctx.request.query;
    const reservationList =
      await ReservationService.getReservationListByStallId(stallId);
    ctx.app.emit("list", ctx, reservationList, reservationList.length);
  }

  // 删除预约
  async remove(ctx) {
    const { id } = ctx.request.body;
    await ReservationService.remove(id);
    ctx.app.emit("success", ctx, true, "预约删除成功");
  }

  // 获取所有预约列表
  async getReservationList(ctx) {
    try {
      const {
        current = 1,
        pageSize = 10,
        stallName,
        phoneNumber,
        status,
      } = ctx.request.body;
      const offset = (current - 1) * pageSize;
      const reservationList = await ReservationService.getReservationList(
        offset,
        pageSize,
        stallName,
        phoneNumber,
        status
      );
      ctx.app.emit("list", ctx, reservationList, reservationList.length);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 审核预约
  async auditReservation(ctx) {
    try {
      const { id } = ctx.params;
      const { status, reason } = ctx.request.body;
      await ReservationService.auditReservation(id, status, reason);
      await noticeController.sendReservationNotice(id, status, reason);
      ctx.app.emit("success", ctx, true);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new ReservationController();
