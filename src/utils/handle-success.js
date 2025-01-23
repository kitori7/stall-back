const app = require("../app");

app.on("success", (ctx, data = true, message = "请求成功") => {
  ctx.body = {
    code: 200,
    data,
    message,
  };
});

app.on("list", (ctx, data = [], total = 0) => {
  ctx.body = {
    code: 200,
    message: true,
    data,
    total,
  };
});
