const ERROR_TYPE = require("../config/error");
const MenuService = require("../service/menu.service");
class MenuController {
  // 创建菜单
  async create(ctx) {
    try {
      const { menuName, routeName } = ctx.request.body;
      await MenuService.create(menuName, routeName);
      ctx.app.emit("success", ctx, true, "菜单创建成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 获取菜单列表
  async list(ctx) {
    try {
      const result = await MenuService.getAllMenus();
      ctx.app.emit("list", ctx, result, result.length);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 更新菜单
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { menuName, routeName } = ctx.request.body;
      await MenuService.update(id, menuName, routeName);
      ctx.app.emit("success", ctx, true, "更新菜单成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 删除菜单
  async remove(ctx) {
    try {
      const { id } = ctx.params;
      await MenuService.remove(id);
      ctx.app.emit("success", ctx, true, "删除菜单成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new MenuController();
