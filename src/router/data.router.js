const KoaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/user.middleware");
const {
  getAdminData,
  getMobileData,
} = require("../controller/data.controller");

const dataRouter = new KoaRouter({
  prefix: "/data",
});

dataRouter.get("/admin", verifyAuth, getAdminData);

dataRouter.get("/mobile/:stallId", verifyAuth, getMobileData);

module.exports = dataRouter;
