const axios = require("axios");
const getAccessToken = require("./tokenmanager.js"); // ✅ Token generator
require("dotenv").config();

async function pushToZohoPeople({ empId, timestamp, eventType }) {
  const accessToken = await getAccessToken(); // ✅ Always fetch fresh token

  const response = await axios.post(
    process.env.ZOHO_PEOPLE_API_URL, // ✅ Set in .env
    {
      EmployeeID: empId,
      FromTime: timestamp,
      ToTime: timestamp,
      EventType: eventType,
      ShiftName: "General"
    },
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

module.exports = pushToZohoPeople;
