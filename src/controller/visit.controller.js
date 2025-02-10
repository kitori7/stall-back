const visitService = require("../service/visit.service");
const stallService = require("../service/stall.service");
const ERROR_TYPE = require("../config/error");

class VisitController {
  async create(ctx) {
    try {
      const { userId, stallId, type, reservationId } = ctx.request.body;
      await visitService.create(userId, stallId, type, reservationId);
      await stallService.updateTotalVisit(stallId);
      ctx.app.emit("success", ctx, true);
    } catch (error) {
      console.log(error);
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new VisitController();
