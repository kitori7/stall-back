const KoaRouter = require("@koa/router");
const { create, list } = require("../controller/comment.controller");
const commentRouter = new KoaRouter({
  prefix: "/comment",
});

// 创建评论
commentRouter.post("/", create);

//  获取评论列表
commentRouter.post("/list", list);

module.exports = commentRouter;
