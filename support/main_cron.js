const { getItems } = require("./motie.js");
const cron = require("node-cron");

async function handleAsync() {
  const rec = await getItems();
  console.log("rec", rec);
}

cron.schedule("*/3 * * * *", async () => {
  console.log("running a task every two minutes");
  await handleAsync();
});