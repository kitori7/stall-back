const ERROR_TYPE = require("../config/error");
const CommentService = require("../service/comment.service");
const StallService = require("../service/stall.service");
class CommentController {
  async create(ctx) {
    try {
      const { userId, stallId, content, rating } = ctx.request.body;
      await CommentService.createComment(userId, stallId, content, rating);
      // 更新摊位平均分
      await StallService.updateStallAverageScore(stallId);
      ctx.app.emit("success", ctx, true, "评论发布成功");
    } catch (error) {
      console.error("评论发布失败:", error);
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }

  async list(ctx) {
    try {
      const { stallId, currentPage = 1, pageSize = 10 } = ctx.request.body;
      const offset = (currentPage - 1) * pageSize;
      const comments = await CommentService.getCommentsByStallId(
        stallId,
        offset,
        pageSize
      );
      ctx.app.emit("list", ctx, comments, comments.length);
    } catch (error) {
      console.error("评论列表获取失败:", error);
      ctx.app.emit("error", ERROR_TYPE.SERVER_ERROR, ctx);
    }
  }
}

module.exports = new CommentController();
