const RoleService = require("../service/role.service");
const ERROR_TYPE = require("../config/error");

// 创建角色
const create = async (ctx) => {
  try {
    const { roleName, menuIds, permissionIds } = ctx.request.body;
    const isExist = await RoleService.getRoleByName(roleName);
    if (isExist) {
      return ctx.app.emit("error", ERROR_TYPE.ROLE_EXIST, ctx);
    }
    await RoleService.create(roleName, menuIds, permissionIds);
    ctx.app.emit("success", ctx, true);
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

// 删除角色
const remove = async (ctx) => {
  try {
    const { id } = ctx.params;
    await RoleService.remove(id);
    ctx.app.emit("success", ctx, true);
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

// 更新角色
const update = async (ctx) => {
  try {
    const { id } = ctx.params;
    const { roleName, menuIds, permissionIds } = ctx.request.body;
    await RoleService.update(id, roleName, menuIds, permissionIds);
    ctx.app.emit("success", ctx, true);
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

// 获取角色列表
const list = async (ctx) => {
  try {
    const result = await RoleService.getAllRoles();
    ctx.app.emit("list", ctx, result, result.length);
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

// 获取角色详情
const detail = async (ctx) => {
  try {
    const { id } = ctx.params;
    const result = await RoleService.getRoleById(id);
    ctx.app.emit("success", ctx, result);
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

module.exports = {
  create,
  remove,
  update,
  list,
  detail,
};
