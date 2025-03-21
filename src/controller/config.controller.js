const ConfigService = require("../service/config.service");
const ERROR_TYPE = require("../config/error");
class ConfigController {
  async getAutoAuditStatus(ctx) {
    try {
      const result = await ConfigService.getAutoAuditStatus();
      ctx.app.emit("success", ctx, result);
    } catch (error) {
      ctx.app.emit("error", ctx, ERROR_TYPE.SERVER_ERROR);
    }
  }

  async setAutoAuditStatus(ctx) {
    try {
      const { status } = ctx.request.body;
      const result = await ConfigService.setAutoAuditStatus(status);
      ctx.app.emit("success", ctx, result);
    } catch (error) {
      ctx.app.emit("error", ctx, ERROR_TYPE.SERVER_ERROR);
    }
  }
}

module.exports = new ConfigController();
