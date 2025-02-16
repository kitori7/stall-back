const app = require("./app/index");
require("./utils/handle-error");
require("./utils/handle-success");

app.listen(5173, () => {
  console.log(`启动成功，端口 5173`);
});
