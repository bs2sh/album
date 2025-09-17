// photoDb.js
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = require('./db');

function addPhoto(path, userKey, userNick, albumKey, regdt) {
  return new Promise((resolve, reject) => {
    const sql = `
            INSERT INTO photo (photo_key, photo_path, owner, owner_nick, album_key, regdt)
            VALUES (?, ?, ?, ?, ?, ?)
        `
    let photoKey = uuidv4()
    const params = [
      photoKey,
      path,
      userKey,
      userNick,
      albumKey,
      regdt
    ]

    db.run(sql, params, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(path)
      }
    })
  })
}

// 사진 삭제
function deletePhoto(photokey, callback) {
  const sql = `DELETE FROM photo WHERE photokey = ?`;
  db.run(sql, [photokey], function (err) {
    callback(err, this ? this.changes : null);
  });
}

/**
 * 커서 방식으로 사진 리스트를 가져오고, albumKey에 속한 전체 row 갯수도 반환
 * @param {string} albumKey - 앨범 키
 * @param {string} lastPhotoKey - 커서(photokey), 첫 페이지는 ''
 * @param {number} pageSize - 페이지당 데이터 수 (default 20)
 * @returns {Promise<{ total: number,  object[] }>}
 */
async function getPhotos(albumKey, lastPhotoKey = '', pageSize = 30) {
  // 1. 전체 row 개수
  function getTotal(albumKey) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) AS cnt FROM photo WHERE album_key = ?`,
        [albumKey],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? row.cnt : 0);
        }
      );
    });
  }

  // 2. 페이징 데이터 얻기 (커서 방식)
  function getFirstPage(albumKey, pageSize) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM photo
         WHERE album_key = ?
         ORDER BY regdt DESC, photo_key DESC
         LIMIT ?`,
        [albumKey, pageSize],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  function getRegdt(photoKey) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT regdt FROM photo WHERE photo_key = ?`,
        [photoKey],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? row.regdt : null);
        }
      );
    });
  }

  function getAfterCursor(albumKey, lastRegdt, lastPhotoKey, pageSize) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM photo
         WHERE album_key = ?
           AND (
             regdt < ?
             OR (regdt = ? AND photo_key < ?)
           )
         ORDER BY regdt DESC, photo_key DESC
         LIMIT ?`,
        [albumKey, lastRegdt, lastRegdt, lastPhotoKey, pageSize],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // 병렬로 전체개수는 항상 미리 읽어둠 (속도 up)
  const totalPromise = getTotal(albumKey);

  // 커서 검사
  let data;
  if (!lastPhotoKey) {
    data = await getFirstPage(albumKey, pageSize);
  } else {
    const lastRegdt = await getRegdt(lastPhotoKey);
    if (lastRegdt === null) throw new Error('Invalid photokey');
    data = await getAfterCursor(albumKey, lastRegdt, lastPhotoKey, pageSize);
  }
  const total = await totalPromise;

  return { total, data };
}


module.exports = {
  addPhoto,
  deletePhoto,
  getPhotos
}