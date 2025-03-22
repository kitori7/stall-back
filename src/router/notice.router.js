const KoaRouter = require("@koa/router");
const {
  getUnreadNoticeCount,
  readReservationNotice,
  getReservationNoticeList,
  getAllReservationNotice,
  deleteReservationNotice,
  batchSendReservationNotice,
} = require("../controller/notice.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const noticeRouter = new KoaRouter({
  prefix: "/notice",
});

// 获取未读通知数量
noticeRouter.get("/count/:stallId", getUnreadNoticeCount);

// 已读通知
noticeRouter.post("/read", readReservationNotice);

// 根据摊位 id 获取通知列表
noticeRouter.get("/:stallId", getReservationNoticeList);

// 获取所有通知
noticeRouter.post("/", verifyAuth, getAllReservationNotice);

// 删除通知
noticeRouter.delete("/:id", verifyAuth, deleteReservationNotice);

// 批量发送通知
noticeRouter.post("/batch", verifyAuth, batchSendReservationNotice);

module.exports = noticeRouter;
