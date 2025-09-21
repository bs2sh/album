// userDb.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
// const path = require('path');

const db = require('./db');
const { resolve } = require('path');

// 테이블 생성 (최초 1회만 실행)
/*
function init() {
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      userkey INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      pw TEXT NOT NULL,
      nick TEXT NOT NULL
    )
  `);
} */

function init() {
  console.log('DBHelper init()')
}

function checkTable() {
  db.all("SELECT nick FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
      console.error('Error reading sqlite_master:', err.message);
    } else {
      console.log('Tables in DB:', rows.map(r => r.name));
    }
  });
}

// 사용자 추가
function addUser(email, pw, nick, callback) {

  const sql = 'INSERT INTO user (email, pw, nick) VALUES (?, ?, ?)';
  console.log('addUser >>>>>>> ' + sql)
  db.run(sql, [email, pw, nick], function (err) {
    callback(err, this ? this.lastID : null);
  });
}

// 전체 사용자 조회
function getAllUsers(callback) {
  db.all('SELECT * FROM user', (err, rows) => {
    callback(err, rows);
  });
}

// userKey로 사용자 조회
function getUserByKey(userKey, callback) {
  db.get('SELECT * FROM user WHERE user_key = ?', [userKey], (err, row) => {
    callback(err, row);
  });
}

function getUserByEmail(email, callback) {
  // db.get('SELECT * FROM user WHERE email = ?', [email], (err, row) => {
  //   callback(err, row);
  // })
  if (typeof email !== 'string' || email.trim() === '') {
    return callback(null, []);
  }

  const pattern = `%${email.trim()}%`;
  const query = 'SELECT * FROM user WHERE email LIKE ?';

  db.all(query, [pattern], (err, rows) => {
    callback(err, rows);
  });
}

function getUsersByKeyString(userKeyString, callback) {
  if (typeof userKeyString !== 'string' || userKeyString.trim() === '') {
    return callback(null, []);
  }

  const userKeys = userKeyString
    .split(',')
    .map(key => key.trim())
    .filter(key => key); // 빈 문자열 제거

  if (userKeys.length === 0) {
    return callback(null, []);
  }

  const placeholders = userKeys.map(() => '?').join(', ');
  const query = `SELECT * FROM user WHERE user_key IN (${placeholders})`;
  db.all(query, userKeys, (err, rows) => {
    callback(err, rows);
  });
}


// 로그인에 사용. 유저키 넘겨줌
function getUserKey(email, pw, callback) {
  const sql = 'SELECT user_key, nick FROM user WHERE email = ? AND pw = ?'
  db.get(sql, [email, pw], (err, row) => {
    if (err) {
      callback(err, null);
    } else if (!row) { // row가 없음.
      console.log('row not exist !!!!')
      callback(null, null)
    } else {
      console.log(row.user_key + ' / ' + row.nick)
      callback(null, row)
    }
  });
}

async function getNick(userKey) {
  console.log('get nickname : ' + userKey);
  return new Promise((resolve, reject) => {
    const sql = 'SELECT nick FROM user WHERE user_key = ?'
    db.get(sql, [userKey], (err, row) => {
      if (err) {
        return reject(err);
      } else if (!row) {
        return reject(Error('No row'));
      }
      
      let nick = row.nick;
      console.log('get nickname row : ' + nick);
      return resolve(nick);
    });  
  })

}

/**
 * join_albums 컬럼에 텍스트를 이어붙이는 함수
 * @param {number} userKey - 대상 user의 userKey
 * @param {string} appendText - 추가할 텍스트
 * @param {function} callback - (err, changes) 전달
 */
function appendToAlbumKey(userKey, albumKey, callback) {
  // 1. 기존 join_albums 값 읽기
  const selectSql = 'SELECT join_albums FROM user WHERE user_key = ?';
  db.get(selectSql, [userKey], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error('User not found'));

    // 2. 기존 값에 appendText 이어붙이기
    const current = row.join_albums || '';
    const updated = current + (row.join_albums == null ? '' : ',') + albumKey;
    console.log('current : ' + current)
    console.log('row.join_albums : ' + row.join_albums)
    console.log('updated : ' + updated)

    // 3. 업데이트
    const updateSql = 'UPDATE user SET join_albums = ? WHERE user_key = ?';
    db.run(updateSql, [updated, userKey], function (err) {
      callback(err, this ? this.changes : 0);
    });
  });
}

function joinalbums(userKey, callback) {
  // 앞뒤 쉼표 추가로 정확하게 매칭
  const sql = `
    SELECT * FROM album
    WHERE ',' || members || ',' LIKE '%,' || ? || ',%'
  `;
  db.all(sql, [userKey], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });

/**
 // 1. 내가 속해있는 앨범 리스트 Text
  db.get('SELECT join_albums FROM user WHERE user_key = ?', userKey, (err, row) => {
    if (err) return callback(err, [])
    if (!row) return callback(new Error('Album not found'), [])

    // 2. 기존 값 배열로 변환
    let albums = row.join_albums ? row.join_albums.split(',').map(String) : [];
    console.log("join albums >> " + albums)
    callback(null, albums)
  })
 */
}

// 사용자 정보 수정
function updateUser(userKey, email, pw, nick, callback) {
  const sql = 'UPDATE user SET email = ?, pw = ?, nick = ? WHERE user_key = ?';
  db.run(sql, [email, pw, nick, userKey], function (err) {
    callback(err, this.changes)
  });
}

// 사용자 삭제
function deleteUser(userKey, callback) {
  db.run('DELETE FROM user WHERE user_key = ?', [userKey], function (err) {
    callback(err, this.changes);
  });
}
/**
 * userKey로 해당 사용자의 join_nalbums에서 albumkey를 분리해 album 정보를 조회
 * @param {string} dbPath - SQLite DB 파일 경로
 * @param {number|string} userKey - 조회할 userKey
 * @returns {Promise<Array>} - album 정보 배열
 */
async function getAlbumsByUserKey(userKey) {
  return new Promise((resolve, reject) => {
    // const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    //   if (err) return reject(err);
    // });

    db.get(
      'SELECT join_albums FROM user WHERE user_key = ?',
      [userKey],
      (err, row) => {
        if (err) {
          // db.close();
          return reject(err);
        }
        if (!row || !row.join_albums) {
          // db.close();
          return resolve([]);
        }

        console.log('join albums >> ' + row.join_albums)
        // 쉼표로 분리해 albumkey 배열 생성
        const albumKeys = row.join_albums
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0);

        if (albumKeys.length === 0) {
          // db.close();
          return resolve([]);
        }

        // albumkey를 바인딩 변수로 만듦
        const placeholders = albumKeys.map(() => '?').join(',');
        const sql = `SELECT * FROM album WHERE album_key IN (${placeholders})`;

        db.all(sql, albumKeys, (err2, albums) => {
          // db.close();
          if (err2) return reject(err2);
          resolve(albums);
        });
      }
    );
  });
}


function closeDB() {
  db.close()
}

module.exports = {
  init,
  addUser,
  getAllUsers,
  getUserByKey,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUserKey,
  getNick,
  closeDB,
  appendToAlbumKey,
  joinalbums,
  getAlbumsByUserKey,
  getUsersByKeyString
};
