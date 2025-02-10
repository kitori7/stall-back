const KoaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/user.middleware");
const { getAdminData } = require("../controller/data.controller");

const dataRouter = new KoaRouter({
  prefix: "/data",
});

dataRouter.get("/admin", verifyAuth, getAdminData);

module.exports = dataRouter;
