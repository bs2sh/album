const sqlite3 = require("sqlite3").verbose();
const DB_FILE = "./src/db/album.sqlite";
const path = require("path");
const fs = require("fs");
const DB_PATH = path.resolve(DB_FILE);

if (fs.existsSync(DB_PATH)) {
  console.log(`✅ DB 파일 존재: ${DB_PATH}`);
} else {
  console.log(`❌ DB 파일 없음: ${DB_PATH}`);
}

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error("DB 연결 실패:", err.message);
  } else {
    console.log("DB 연결 성공");
  }
});

module.exports = db;
