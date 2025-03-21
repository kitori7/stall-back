const KoaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/user.middleware");
const {
  create,
  getReservationTime,
  getReservationListByStallId,
  remove,
  getReservationList,
  auditReservation,
} = require("../controller/reservation.controller");

const reservationRouter = new KoaRouter({
  prefix: "/reservation",
});

// 创建预约
reservationRouter.post("/", verifyAuth, create);

// 获取当天预约时段
reservationRouter.get("/times", verifyAuth, getReservationTime);

// 删除预约
reservationRouter.delete("/", verifyAuth, remove);

// 获取预约列表
reservationRouter.get("/", verifyAuth, getReservationListByStallId);

// 获取所有预约列表
reservationRouter.post("/all", verifyAuth, getReservationList);

// 审核预约
reservationRouter.post("/audit/:id", verifyAuth, auditReservation);

module.exports = reservationRouter;
