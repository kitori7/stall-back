const app = require("../app");
const ERROR_TYPE = require("../config/error");

app.on("error", (error, ctx) => {
  let code = 0;
  let message = "";
  switch (error) {
    case ERROR_TYPE.NAME_OR_PASSWORD_IS_REQUIRED:
      code = -1001;
      message = "用户名或密码不能为空";
      break;
    case ERROR_TYPE.USER_ALREADY_EXISTS:
      code = -1002;
      message = "用户已存在";
      break;
    case ERROR_TYPE.USER_DOES_NOT_EXIST:
      code = -1003;
      message = "用户不存在";
      break;
    case ERROR_TYPE.PASSWORD_IS_INCORRECT:
      code = -1004;
      message = "密码错误";
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
