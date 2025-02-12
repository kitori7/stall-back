const KoaRouter = require("@koa/router");
const { create } = require("../controller/visit.controller");
const visitRouter = new KoaRouter({
  prefix: "/visit",
});

visitRouter.post("/", create);

module.exports = visitRouter;
