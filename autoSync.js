require("dotenv").config();
const sync = require("./src/zoho/sync.js");

console.log("🚀 Real-time Auto-sync started...");

// Run sync immediately on startup
sync().catch(console.error);

// ⚡ REAL-TIME: Check every 30 seconds instead of 1 hour
setInterval(async () => {
  console.log("⚡ Quick sync check...");
  try {
    await sync();
    // Only log if there were actual records
  } catch (error) {
    console.error("❌ Quick sync failed:", error.message);
  }
}, 30 * 1000); // Every 30 seconds

// Also keep hourly sync as backup
setInterval(async () => {
  console.log("⏰ Hourly backup sync...");
  try {
    await sync();
    console.log("✅ Hourly sync completed");
  } catch (error) {
    console.error("❌ Hourly sync failed:", error.message);
  }
}, 60 * 60 * 1000); // Every 1 hour

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Received SIGINT, shutting down gracefully');
  process.exit(0);
});