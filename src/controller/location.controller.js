const LocationService = require("../service/location.service");
const ERROR_TYPE = require("../config/error");
class LocationController {
  async create(ctx) {
    const { locationName, availableWeekdays, availableTime, coordinates } =
      ctx.request.body;

    const location = await LocationService.getLocationName(locationName);
    if (location.length > 0) {
      return ctx.app.emit(
        "error",
        ERROR_TYPE.LOCATION_NAME_ALREADY_EXISTS,
        ctx
      );
    }
    await LocationService.create(
      locationName,
      availableWeekdays,
      availableTime,
      coordinates
    );
    ctx.app.emit("success", ctx, true, "创建位置成功");
  }

  async update(ctx) {
    const { id } = ctx.params;
    const { locationName, availableWeekdays, availableTime } = ctx.request.body;
    console.log(id);
    await LocationService.update(id, {
      locationName,
      availableWeekdays,
      availableTime,
    });
    ctx.app.emit("success", ctx, true, "更新位置成功");
  }

  async detail(ctx) {
    const { id } = ctx.params;
    const location = await LocationService.detail(id);
    ctx.app.emit("success", ctx, location);
  }

  async list(ctx) {
    const { current = 1, pageSize = 10, locationName } = ctx.request.body;
    const offset = (current - 1) * pageSize;
    const locations = await LocationService.list(
      offset,
      pageSize,
      locationName
    );
    ctx.app.emit("list", ctx, locations, locations.length);
  }

  async remove(ctx) {
    const { id } = ctx.params;
    await LocationService.remove(id);
    ctx.app.emit("success", ctx, true, "删除位置成功");
  }

  async reservation(ctx) {
    try {
      const { id } = ctx.params;
      const reservation = await LocationService.getReservation(id);
      ctx.app.emit("success", ctx, reservation);
    } catch (error) {
      console.log(error);
      ctx.app.emit("error", ctx, ERROR_TYPE.SERVER_ERROR);
    }
  }
  async reservationNow(ctx) {
    try {
      const { id } = ctx.params;
      const reservation = await LocationService.getReservationNow(id);
      ctx.app.emit("success", ctx, reservation);
    } catch (error) {
      console.log(error);
      ctx.app.emit("error", ctx, ERROR_TYPE.SERVER_ERROR);
    }
  }
}

module.exports = new LocationController();
