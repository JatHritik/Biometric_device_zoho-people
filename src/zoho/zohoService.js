const axios = require("axios");
const getAccessToken = require("./tokenmanager.js");
require("dotenv").config();

async function pushToZohoPeople({ empId, timestamp, eventType }) {
  try {
    console.log(`🚀 Pushing to Zoho People: ${empId} - ${eventType}`);
    
    const accessToken = await getAccessToken();
    
    const payload = {
      EmployeeID: empId,
      FromTime: timestamp.toISOString(),
      ToTime: timestamp.toISOString(),
      EventType: eventType,
      ShiftName: "General"
    };

    const response = await axios.post(
      process.env.ZOHO_PEOPLE_API_URL,
      payload,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log(`✅ Successfully pushed to Zoho People: ${empId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error(`❌ Zoho API Error (${error.response.status}):`, error.response.data);
      throw new Error(`Zoho API returned ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("❌ No response from Zoho API:", error.message);
      throw new Error("No response from Zoho API");
    } else {
      // Something happened in setting up the request
      console.error("❌ Request setup error:", error.message);
      throw error;
    }
  }
}

module.exports = pushToZohoPeople;