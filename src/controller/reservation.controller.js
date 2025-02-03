const ERROR_TYPE = require("../config/error");
const ReservationService = require("../service/reservation.service");

class ReservationController {
  // 创建预约
  async create(ctx) {
    try {
      const { date, times, locationId, stallId } = ctx.request.body;
      times.forEach(async (time) => {
        await ReservationService.create(date, time, locationId, stallId);
      });
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
    const data = reservationTime.map((item) => item.time);
    ctx.app.emit("success", ctx, data);
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
    const { ids } = ctx.request.body;
    for (const id of ids) {
      await ReservationService.remove(id);
    }
    ctx.app.emit("success", ctx, true, "预约删除成功");
  }
}

module.exports = new ReservationController();
