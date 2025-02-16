const KoaRouter = require("@koa/router");
const {
  create,
  list,
  update,
  detail,
  remove,
  reservation,
  reservationNow,
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

// 获取当前位置的预约数据
locationRouter.get("/reservation/:id", verifyAuth, reservation);

// 获取现在预约数据
locationRouter.get("/reservation/now/:id", verifyAuth, reservationNow);
module.exports = locationRouter;
