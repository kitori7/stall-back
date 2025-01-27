const ERROR_TYPE = require("../config/error");
const StallService = require("../service/stall.service");
const EmployeeService = require("../service/employee.service");
const StallUserService = require("../service/stall_user.service");
const StallRecordService = require("../service/stall_record.service");
// 创建摊位
const create = async (ctx) => {
  const {
    userName,
    password,
    phoneNumber,
    stallName,
    ownerName,
    ownerIdCard,
    ownerPhoneNumber,
    stallHeadImg,
    stallDetailImg,
    stallDesc,
    businessImg,
    foodSafetyImg,
    individualImg,
    employees,
  } = ctx.request.body;
  try {
    // 第一步：创建摊位用户
    const user = await StallUserService.createUser(
      userName,
      password,
      phoneNumber,
      "1"
    );

    // 第二步：创建摊位
    const stall = await StallService.createStall(
      user.insertId,
      stallName,
      ownerName,
      ownerIdCard,
      ownerPhoneNumber,
      stallHeadImg,
      stallDetailImg,
      stallDesc,
      businessImg,
      foodSafetyImg,
      individualImg
    );

    // 第三步：创建员工
    employees.forEach(async (employee) => {
      const { name, phoneNumber, idCard, healthImg } = employee;
      await EmployeeService.createEmployee(
        name,
        phoneNumber,
        idCard,
        healthImg,
        stall.insertId
      );
    });
    // 第四步：创建记录表
    await StallRecordService.createRecord(stall.insertId, "0");

    ctx.app.emit(
      "success",
      ctx,
      {
        stallId: stall.insertId,
        userId: user.insertId,
      },
      "摊位创建成功"
    );
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR);
  }
};

// 获取审核时间线
const timeline = async (ctx) => {
  const { id } = ctx.params;
  const result = await StallRecordService.getTimeline(id);
  ctx.app.emit("success", ctx, result);
};

// 更新摊位
const update = async (ctx) => {
  const { id } = ctx.params;
  const {
    stallName,
    ownerName,
    ownerIdCard,
    ownerPhoneNumber,
    stallHeadImg,
    stallDetailImg,
    stallDesc,
    businessImg,
    foodSafetyImg,
    individualImg,
    employees,
  } = ctx.request.body;
  try {
    const result = await StallService.updateStall(id, {
      stallName,
      ownerName,
      ownerIdCard,
      ownerPhoneNumber,
      stallHeadImg,
      stallDetailImg,
      stallDesc,
      businessImg,
      foodSafetyImg,
      individualImg,
      status: "0", //状态重置为待审核
    });

    // 更新员工信息
    if (employees && employees.length > 0) {
      await Promise.all(
        employees.map(async (employee) => {
          const {
            id: employeeId,
            name,
            phoneNumber,
            idCard,
            healthImg,
          } = employee;
          await EmployeeService.updateEmployee(employeeId, {
            name,
            phoneNumber,
            idCard,
            healthImg,
            stallId: id,
          });
        })
      );
    }

    // 创建摊位记录
    await StallRecordService.createRecord(id, "0");
    ctx.app.emit("success", ctx, result);
  } catch (error) {
    console.error(error);
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

// 获取摊位详情
const detail = async (ctx) => {
  const { id } = ctx.params;
  try {
    const result = await StallService.getStallDetail(id);
    ctx.app.emit("success", ctx, result);
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

// 获取摊位列表
const list = async (ctx) => {
  try {
    const {
      current = 1,
      pageSize = 10,
      stallName,
      ownerName,
      ownerPhoneNumber,
      status,
    } = ctx.request.body;
    const offset = (current - 1) * pageSize;
    const result = await StallService.getAllStalls(
      offset,
      pageSize,
      stallName,
      ownerName,
      ownerPhoneNumber,
      status
    );
    ctx.app.emit("list", ctx, result, result.length);
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

// 摊位审核通过
const audit = async (ctx) => {
  const { id } = ctx.params;
  // 修改摊位状态为通过
  await StallService.editStallStatus(id, "1");
  // 创建摊位记录
  await StallRecordService.createRecord(id, "1");
  ctx.app.emit("success", ctx, true, "摊位审核通过");
};

// 摊位审核驳回
const reject = async (ctx) => {
  const { id } = ctx.params;
  const { reason } = ctx.request.body;
  // 修改摊位状态为2
  await StallService.editStallStatus(id, "2");
  // 创建摊位记录
  await StallRecordService.createRecord(id, "2", reason);
  ctx.app.emit("success", ctx, true, "摊位审核驳回");
};

module.exports = {
  create,
  update,
  detail,
  list,
  timeline,
  audit,
  reject,
};
