const netflix = require("./netflix.js"); // 넷플릭스

async function handleAsync() {
  // 넷플릭스
  const netflixRes = await netflix.getItems();
  console.log(netflixRes);
}

handleAsync();
