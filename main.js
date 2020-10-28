const motie = require("./motie.js");
const msit = require("./msit.js");
const mss = require("./mss.js");

async function handleAsync() {
  const motieRes = await motie.getItems();
  console.log(motieRes);
  const msitRes = await msit.getItems();  
  console.log(msitRes);
  const mssRes = await mss.getItems();  
  console.log(mssRes);  
}

handleAsync();
