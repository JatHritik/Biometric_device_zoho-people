const ZKLib = require("node-zklib");
require("dotenv").config();

const zk = new ZKLib(
  process.env.DEVICE_IP, 
  Number(process.env.DEVICE_PORT), 
  5000, // timeout
  4000  // inport
);

async function fetchLogs() {
  try {
    console.log(`🔌 Connecting to ZK device at ${process.env.DEVICE_IP}:${process.env.DEVICE_PORT}`);
    
    await zk.createSocket();
    console.log("✅ Connected to ZK device");
    
    const logs = await zk.getAttendances();
    console.log(`📊 Retrieved ${logs.data?.length || 0} attendance records`);
    
    await zk.disconnect();
    console.log("🔌 Disconnected from ZK device");
    
    return logs.data || [];
  } catch (error) {
    console.error("❌ Failed to fetch logs from ZK device:", error.message);
    
    // Try to disconnect even if there was an error
    try {
      await zk.disconnect();
    } catch (disconnectError) {
      console.error("❌ Failed to disconnect:", disconnectError.message);
    }
    
    throw error;
  }
}

module.exports = fetchLogs;