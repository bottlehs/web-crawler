const yna = require("./yna.js"); // 연합뉴스

async function handleAsync() {
  // 연합뉴스
  const ynaRes = await yna.getItems();
  console.log(ynaRes);
}

handleAsync();
