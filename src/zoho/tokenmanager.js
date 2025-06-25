const axios = require("axios");
require("dotenv").config();

let cachedToken = null;

async function getAccessToken() {
  if (cachedToken) return cachedToken;

  try {
    const response = await axios.post(process.env.ZOHO_TOKEN_URL, null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    });

    const { access_token } = response.data;
    cachedToken = access_token;

    // Optional: expire cache after 50 mins
    setTimeout(() => {
      cachedToken = null;
    }, 50 * 60 * 1000);

    return access_token;
  } catch (err) {
    console.error("Failed to refresh Zoho token:", err.response?.data || err.message);
    throw new Error("Could not refresh access token");
  }
}

module.exports = getAccessToken;
