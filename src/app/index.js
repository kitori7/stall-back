const Koa = require("koa");
const userRouter = require("../router/user.router");
const bodyParser = require("koa-bodyparser");
const registerRouter = require("../router");

// 创建app
const app = new Koa();

app.use(bodyParser());
// 动态注册路由
registerRouter(app);

module.exports = app;
