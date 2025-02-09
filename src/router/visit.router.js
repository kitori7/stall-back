const KoaRouter = require("@koa/router");
const { verifyAuth } = require("../middleware/user.middleware");
const { create } = require("../controller/visit.controller");
const visitRouter = new KoaRouter({
  prefix: "/visit",
});

visitRouter.post("/", verifyAuth, create);

module.exports = visitRouter;
