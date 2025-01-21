const fs = require("fs");

function registerRouter(app) {
  // 读取当前文件夹所有文件
  const files = fs.readdirSync(__dirname);
  // 过滤出.router.js文件
  const routerFiles = files.filter((file) => file.endsWith(".router.js"));
  // 导入所有router文件
  routerFiles.forEach((file) => {
    const router = require(`./${file}`);
    app.use(router.routes());
    app.use(router.allowedMethods());
  });
}

module.exports = registerRouter;
