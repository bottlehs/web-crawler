const motie = require("./motie.js");
const msit = require("./msit.js");

async function handleAsync() {
  const motieRes = await motie.getItems();
  console.log(motieRes);
  const msitRes = await msit.getItems();  
  console.log(msitRes);
}

handleAsync();
