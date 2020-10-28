const motie = require("./motie.js"); // 산업통상자원부
const msit = require("./msit.js"); // 과학기술정보통신부
const mss = require("./mss.js"); // 중소벤처기업부
const pps = require("./pps.js"); // 조달청

async function handleAsync() {
  // 산업통상자원부
  const motieRes = await motie.getItems();
  console.log(motieRes);
  // 과학기술정보통신부
  const msitRes = await msit.getItems();  
  console.log(msitRes);
  // 중소벤처기업부
  const mssRes = await mss.getItems();  
  console.log(mssRes);  
  // 조달청
  const mssPps = await pps.getItems();  
  console.log(mssPps);    
}

handleAsync();
