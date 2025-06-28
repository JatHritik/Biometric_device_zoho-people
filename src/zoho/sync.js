require("dotenv").config();
const fetchLogs = require("../zoho/zkService.js");
const prisma = require("../db/db.js");
const pushToZohoPeople = require("../zoho/zohoService.js");

async function sync() {
  try {
    console.log("🔄 Starting sync process...");
    const logs = await fetchLogs();
    
    if (!logs || logs.length === 0) {
      console.log("📭 No new attendance logs found");
      return;
    }

    console.log(`📊 Found ${logs.length} attendance records to sync`);

    for (const log of logs) {
      try {
        const data = {
          empId: String(log.userId),
          empName: log.name || "Unknown",
          date: new Date(log.timestamp),
          time: new Date(log.timestamp).toTimeString().split(' ')[0], // HH:MM:SS format
          eventType: log.type === 0 ? "IN" : "OUT"
        };

        // Check if record already exists
        const existing = await prisma.attendance.findFirst({
          where: {
            empId: data.empId,
            date: data.date,
            time: data.time,
            eventType: data.eventType
          }
        });

        if (existing) {
          console.log(`⏭️  Skipping duplicate record for ${data.empId} at ${data.time}`);
          continue;
        }

        // Save to DB
        const saved = await prisma.attendance.create({
          data: {
            empId: data.empId,
            empName: data.empName,
            date: data.date,
            time: data.time,
            eventType: data.eventType,
            zohoSynced: false
          }
        });

        console.log(`💾 Saved to DB: ${data.empId} at ${data.time}`);

        // Push to Zoho
        try {
          await pushToZohoPeople({
            empId: data.empId,
            timestamp: data.date,
            eventType: data.eventType
          });

          await prisma.attendance.update({
            where: { id: saved.id },
            data: { zohoSynced: true }
          });

          console.log(`✅ Synced to Zoho: ${data.empId} at ${data.time}`);
        } catch (zohoError) {
          console.error(`❌ Failed to sync to Zoho for ${data.empId}:`, zohoError.message);
          // Record is still saved in DB but not synced to Zoho
        }
      } catch (recordError) {
        console.error(`❌ Failed to process record for user ${log.userId}:`, recordError.message);
        continue; // Continue with next record
      }
    }

    console.log("🎉 Sync process completed");
  } catch (error) {
    console.error("💥 Sync process failed:", error.message);
    throw error;
  }
}

// Allow this file to be imported or run directly
if (require.main === module) {
  sync()
    .then(() => {
      console.log("✅ Manual sync completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Manual sync failed:", error);
      process.exit(1);
    });
}

module.exports = sync;