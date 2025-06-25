const ZKLib = require("node-zklib");
require("dotenv").config();

const zk = new ZKLib(process.env.DEVICE_IP, Number(process.env.DEVICE_PORT), 5000);

async function fetchLogs() {
  await zk.createSocket();
  const logs = await zk.getAttendances();
  await zk.disconnect();
  return logs.data;
}

module.exports = fetchLogs;
