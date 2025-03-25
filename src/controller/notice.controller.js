const connection = require("../app/database");
const ERROR_TYPE = require("../config/error");
const noticeService = require("../service/notice.service");
const formatTimes = require("../utils/formartTimes");

class NoticeController {
  // 发送预约通知
  async sendReservationNotice(id, status, reason) {
    // 获取预约信息
    const querySql = `SELECT 
      s.id AS stallId ,
      s.stall_name AS stallName,
      r.date AS date,
      r.times AS times,
      l.location_name AS locationName
      FROM reservation r
      LEFT JOIN location l ON r.location_id = l.id
      LEFT JOIN stall s ON r.stall_id = s.id 
      WHERE r.id = ?`;
    const [res] = await connection.execute(querySql, [id]);
    const stallId = res[0].stallId;
    const stallName = res[0].stallName;
    // 格式化日期，将数据库时间格式转换为 YYYY-MM-DD 格式
    const date = res[0].date
      ? new Date(res[0].date).toISOString().split("T")[0]
      : "";
    const times = formatTimes(res[0].times);
    const locationName = res[0].locationName;
    // 如果 status 是 1 则是以驳回，发送驳回通知
    if (status === "1") {
      const content = `您的摊位"${stallName}"在【${locationName}】位置申请的${date} ${times}时段预约已被驳回。驳回原因：${reason}`;
      await noticeService.sendNotice(stallId, "0", content);
    } else if (status === "2") {
      const content = `您的摊位"${stallName}"在【${locationName}】位置申请的${date} ${times}时段预约已通过审核。`;
      await noticeService.sendNotice(stallId, "0", content);
    } else if (status === "0") {
      const content = `您的摊位"${stallName}"在【${locationName}】位置申请的${date} ${times}时段预约已提交审核。请耐心等待审核结果。`;
      await noticeService.sendNotice(stallId, "0", content);
    }
  }

  // 获取未读通知数量
  async getUnreadNoticeCount(ctx) {
    try {
      const { stallId } = ctx.params;
      const count = await noticeService.getUnreadNoticeCount(stallId);
      ctx.app.emit("success", ctx, count["COUNT(*)"]);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 已读通知
  async readReservationNotice(ctx) {
    try {
      const { ids } = ctx.request.body;
      ids.forEach(async (id) => {
        await noticeService.readReservationNotice(id);
      });
      ctx.app.emit("success", ctx, true);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 根据摊位 id 获取通知列表
  async getReservationNoticeList(ctx) {
    try {
      const { stallId } = ctx.params;
      const result = await noticeService.getNoticeListByStallId(stallId);
      const list = result.map((item) => {
        return {
          ...item,
          isRead: item.isRead === "1" ? true : false,
        };
      });
      ctx.app.emit("list", ctx, list, list.length);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 获取所有通知
  async getAllReservationNotice(ctx) {
    try {
      const { stallName, adminName, type } = ctx.request.body;
      const result = await noticeService.getAllReservationNotice(
        stallName,
        adminName,
        type
      );
      const list = result.map((item) => {
        return {
          ...item,
          isRead: item.isRead === "1" ? true : false,
        };
      });
      ctx.app.emit("list", ctx, list, list.length);
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 删除通知
  async deleteReservationNotice(ctx) {
    try {
      const { id } = ctx.params;
      await noticeService.deleteReservationNotice(id);
      ctx.app.emit("success", ctx, true, "删除成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  // 批量发送通知
  async batchSendReservationNotice(ctx) {
    try {
      const { stallIds, content } = ctx.request.body;
      const adminId = ctx.user.id;
      stallIds.forEach(async (stallId) => {
        await noticeService.sendNotice(stallId, "1", content, adminId);
      });
      ctx.app.emit("success", ctx, true, "通知发送成功");
    } catch (error) {
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}
module.exports = new NoticeController();
