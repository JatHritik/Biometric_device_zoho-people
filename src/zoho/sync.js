require("dotenv").config();
const fetchLogs = require("./zkService.js");
const prisma = require("../db/db.js");
const pushToZohoPeople = require("./zohoService.js");

async function sync() {
  const logs = await fetchLogs();

  for (const log of logs) {
    const data = {
      empId: String(log.userId),
      empName: log.name,
      timestamp: new Date(log.timestamp),
      eventType: log.type === 0 ? "IN" : "OUT"
    };

    // Save to DB
    const saved = await prisma.attendance.create({
      data: {
        ...data,
        zohoSynced: false
      }
    });

    // Push to Zoho
    try {
      await pushToZohoPeople(data);

      await prisma.attendance.update({
        where: { id: saved.id },
        data: { zohoSynced: true }
      });

      console.log(`Synced ${data.empId} at ${data.timestamp}`);
    } catch (e) {
      console.log(`Failed to sync Zoho for ${data.empId}`);
    }
  }
}

// ✅ Allow this file to be imported or run directly
if (require.main === module) {
  sync().then(() => process.exit());
}

module.exports = sync;
