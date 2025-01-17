const KoaRouter = require("@koa/router");

const userRouter = new KoaRouter({
  prefix: "/user",
});

userRouter.get("/list", (ctx) => {
  console.log(ctx.response);
  ctx.body = ["userList"];
});

module.exports = userRouter;
