const app = require("../app");

app.on("success", (ctx, data = true, message = "请求成功") => {
  ctx.body = {
    code: 200,
    data,
    message,
  };
});
