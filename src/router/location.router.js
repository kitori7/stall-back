const KoaRouter = require("@koa/router");
const {
  create,
  list,
  update,
  detail,
  remove,
} = require("../controller/location.controller");
const { verifyAuth } = require("../middleware/user.middleware");
const locationRouter = new KoaRouter({
  prefix: "/location",
});

// 创建位置
locationRouter.post("/", verifyAuth, create);

// // 更新位置
locationRouter.patch("/:id", verifyAuth, update);

// // 删除位置
locationRouter.delete("/:id", verifyAuth, remove);

// // 获取位置详情
locationRouter.get("/:id", verifyAuth, detail);

// // 获取位置列表
locationRouter.post("/list", verifyAuth, list);

module.exports = locationRouter;
