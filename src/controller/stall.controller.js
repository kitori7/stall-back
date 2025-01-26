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
    console.log(user.insertId);

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

    ctx.app.emit("success", ctx, stall.insertId, "摊位创建成功");
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
    userName,
    password,
    phoneNumber,
    stallName,
    ownerName,
    ownerId,
    ownerPhoneNumber,
    stallHeadImg,
    stallDetailImg,
    stallDesc,
    businessImg,
    foodSafetyImg,
    individualImg,
  } = ctx.request.body;
  try {
    const result = await StallService.updateStall(
      id,
      userName,
      password,
      phoneNumber,
      stallName,
      ownerName,
      ownerId,
      ownerPhoneNumber,
      stallHeadImg,
      stallDetailImg,
      stallDesc,
      businessImg,
      foodSafetyImg,
      individualImg
    );
    ctx.app.emit("success", ctx, result);
  } catch (error) {
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
    const result = await StallService.getStallList();
    ctx.app.emit("success", ctx, result);
  } catch (error) {
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
  }
};

module.exports = {
  create,
  update,
  detail,
  list,
  timeline,
};
