const fs = require("fs");
const db = require("./db");

async function upsertToken(userKey, device, token) {
  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO token (user_key, token, device)
    VALUES (?, ?, ?)
    ON CONFLICT(user_key) 
    DO UPDATE SET
      token = excluded.token,
      device = excluded.device
    `;
    db.run(sql, [userKey, token, device], function (err) {
      console.log("changes ;" + this.changes);
      if (err) {
        console.error(err.message);
        return reject(err);
      }
      return resolve(this);
    });
  });
}

function deleteToken(userKey) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM token WHERE user_key = ?";

    db.run(sql, [userKey], function (err) {
      if (err) {
        reject(err); // 에러 발생 시
      } else {
        // 성공 시 (this.changes로 삭제된 갯수 확인 가능)
        resolve(this);
      }
    });
  });
}

module.exports = {
  upsertToken,
  deleteToken,
};
