const ERROR_TYPE = require("../config/error");
const StallService = require("../service/stall.service");

// 创建摊位
const create = async (ctx) => {
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
    const result = await StallService.createStall(
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
    ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR);
  }
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
};
