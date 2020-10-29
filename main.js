const motie = require("./motie.js"); // 산업통상자원부
const msit = require("./msit.js"); // 과학기술정보통신부
const mss = require("./mss.js"); // 중소벤처기업부
const pps = require("./pps.js"); // 조달청
<<<<<<< HEAD
const kimst = require("./kimst.js"); // 해양수산부
const mfds = require("./mfds.js"); // 식품의약품안전처
const me = require("./me.js"); // 환경부
=======
>>>>>>> parent of 7f82e9a... 식품의약품안전처 - 사업공고 크롤링

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
<<<<<<< HEAD
  // 해양수산부
  const kimstPps = await kimst.getItems();  
  console.log(kimstPps);      
  // 식품의약품안전처
  const mfdsPps = await mfds.getItems();  
  console.log(mfdsPps);      
  // 환경부
  const mePps = await me.getItems();  
  console.log(mePps);        
=======
>>>>>>> parent of 7f82e9a... 식품의약품안전처 - 사업공고 크롤링
}

handleAsync();
