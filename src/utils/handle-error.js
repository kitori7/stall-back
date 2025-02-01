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
    case ERROR_TYPE.UNAUTHORIZED:
      code = -1005;
      message = "未授权";
      break;
    case ERROR_TYPE.SERVER_ERROR:
      code = -1006;
      message = "服务器错误";
      break;
    case ERROR_TYPE.ROLE_EXIST:
      code = -1007;
      message = "角色已存在";
      break;
    case ERROR_TYPE.USER_STATUS_NOT_PASSED:
      code = -1008;
      message = "摊位状态审核未通过或已驳回";
      break;
    case ERROR_TYPE.STALL_STATUS_DISABLE:
      code = -1009;
      message = "摊位已禁用,请联系管理员";
      break;
    case ERROR_TYPE.LOCATION_NAME_ALREADY_EXISTS:
      code = -1010;
      message = "位置名称已存在";
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
