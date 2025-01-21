const app = require("../app");

app.on("success", (ctx, data, message) => {
  ctx.body = {
    code: 200,
    data,
    message,
  };
});
