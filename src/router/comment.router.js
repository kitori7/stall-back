const KoaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/user.middleware");
const {
  create,
  list,
  update,
  detail,
  remove,
} = require("../controller/comment.controller");
const commentRouter = new KoaRouter({
  prefix: "/comment",
});

// 创建评论
commentRouter.post("/", verifyAuth, create);

// // 更新评论
// commentRouter.patch("/:id", verifyAuth, update);

// // 删除评论
// commentRouter.delete("/:id", verifyAuth, remove);

//  获取评论列表
commentRouter.post("/list", verifyAuth, list);

module.exports = commentRouter;
