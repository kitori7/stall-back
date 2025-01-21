const app = require("./app/index");
const { SERVER_PORT } = require("./config/server");
require("./utils/handle-error");
require("./utils/handle-success");

app.listen(SERVER_PORT, () => {
  console.log(`启动成功，端口 ${SERVER_PORT}`);
});
