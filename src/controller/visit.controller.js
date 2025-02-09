const visitService = require("../service/visit.service");
const ERROR_TYPE = require("../config/error");

class VisitController {
  async create(ctx) {
    try {
      const { userId, stallId, type, reservationId } = ctx.request.body;
      await visitService.create(userId, stallId, type, reservationId);
      ctx.app.emit("success", ctx, true);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new VisitController();
