require("dotenv").config();
const sync = require("../src/zoho/sync.js");

console.log("Auto-sync started...");

setInterval(async () => {
  console.log("Syncing attendance...");
  await sync();
}, 60*60 * 1000); // Every 1 hour
