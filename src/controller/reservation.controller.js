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
}

module.exports = new ReservationController();
