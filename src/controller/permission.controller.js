const permissionService = require("../service/permission.service");
const ERROR_TYPE = require("../config/error");
class PermissionController {
  // 创建权限
  async create(ctx) {
    try {
      const { name, code } = ctx.request.body;
      await permissionService.create(name, code);
      ctx.app.emit("success", ctx, true);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 获取权限列表
  async list(ctx) {
    try {
      const result = await permissionService.list();
      ctx.app.emit("list", ctx, result, result.length);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 更新权限
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { name, code } = ctx.request.body;
      await permissionService.update(id, name, code);
      ctx.app.emit("success", ctx, true);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 删除权限
  async remove(ctx) {
    try {
      const { id } = ctx.params;
      await permissionService.remove(id);
      ctx.app.emit("success", ctx, true);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new PermissionController();
