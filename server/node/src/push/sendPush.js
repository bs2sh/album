const admin = require("firebase-admin");
const tokenDB = require("../db/tokenDB");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Send push notification to a user
 * @param {number} userKey - The user's unique key
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data payload (optional)
 */
async function sendPushToUser(userKey, title, body, data = {}) {
  try {
    const tokenInfo = await tokenDB.getToken(userKey);

    if (!tokenInfo || !tokenInfo.token) {
      console.log(`No token found for userKey: ${userKey}`);
      return { success: false, message: "No token found" };
    }

    const { token, device } = tokenInfo;
    const message = {
      token: token,
      data: data, // Common data payload
    };

    // Platform specific payload structure
    if (device === "android") {
      // Android prefers 'data' only for background handling or 'notification' + 'data'
      // Ensuring high priority
      message.android = {
        priority: "high",
        notification: {
          title: title,
          body: body,
        },
      };
    } else if (device === "ios") {
      // iOS requires 'notification' payload for alerts
      message.notification = {
        title: title,
        body: body,
      };
      message.apns = {
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
            sound: "default",
          },
        },
      };
    } else {
      // Fallback or default
       message.notification = {
        title: title,
        body: body,
      };
    }

    const response = await admin.messaging().send(message);
    console.log(`Successfully sent message to user ${userKey} (${device}):`, response);
    return { success: true, response: response };

  } catch (error) {
    console.error(`Error sending push to user ${userKey}:`, error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPushToUser,
};
