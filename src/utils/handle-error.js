const app = require("../app");
const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  USER_ALREADY_EXISTS,
} = require("../config/error");

app.on("error", (error, ctx) => {
  let code = 0;
  let message = "";
  switch (error) {
    case NAME_OR_PASSWORD_IS_REQUIRED:
      code = -1001;
      message = "用户名或密码不能为空";
      break;
    case USER_ALREADY_EXISTS:
      code = -1002;
      message = "用户已存在";
      break;
    default:
      code = -1000;
      message = "未知错误";
      break;
  }

  ctx.body = {
    code,
    message,
  };
});
