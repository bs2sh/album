// albumDb.js
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
// const DB_FILE = './album.sqlite';

const db = require('./db')

// 테이블 생성 (최초 1회만 실행)
// function init() {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS album (
//       album_key INTEGER PRIMARY KEY AUTOINCREMENT,
//       albumtitle TEXT NOT NULL,
//       menbers TEXT NOT NULL,
//       owner INTEGER NOT NULL,
//       enable INTEGER NOT NULL
//     )
//   `);
// }

// 앨범 추가 (member는 userkey를 쉼표로 구분한 문자열)
function addAlbum(title, memberArray, owner, enable, callback) {
  const albumKey = uuidv4();
  const memberText = memberArray.join(','); // 배열 → "1,2,3" 형태의 문자열
  const sql = 'INSERT INTO album (album_key, title, members, owner, enable) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [albumKey, title, memberText, owner, enable], function (err) {
    callback(err, albumKey);
  });
}

// 전체 앨범 조회 (member는 쉼표로 split해서 배열로 변환해 반환)
function getAllAlbums(callback) {
  db.all('SELECT * FROM album', (err, rows) => {
    if (rows) {
      rows.forEach(row => {
        row.members = row.members ? row.members.split(',').map(Number) : [];
      });
    }
    callback(err, rows);
  });
}

// album_key로 앨범 조회
function getAlbumByKey(albumKey, callback) {
  db.get('SELECT * FROM album WHERE album_key = ?', [albumKey], (err, row) => {
    if (row) {
      row.members = row.members ? row.members.split(',').map(Number) : [];
    }
    callback(err, row);
  });
}

async function getAlbumTitleByKey(albumKey) {
  console.log('album key : ' + albumKey);
  return new Promise((resolve, reject) => {
    db.get('SELECT title FROM album WHERE album_key = ?', [albumKey], (err, row) => {
      console.log('album title ' + row);
      if (err) {
        return reject(err);
      }
      if (!row || !row.title) {
        return reject(Error('No rows'));
      }
      
      const albumTitle = row.title;
      return resolve(albumTitle);
    });
  });


  // db.get('SELECT album_title FROM album WHERE album_key = ?', [albumKey], (err, row) => {
  //   callback(err, row);
  // });
}

// 앨범 정보 수정
function updateAlbum(albumKey, title, memberArray, owner, enable, callback) {
  const memberText = memberArray.join(',');
  const sql = 'UPDATE album SET title = ?, members = ?, owner = ?, enable = ? WHERE album_key = ?';
  db.run(sql, [title, memberText, owner, enable, albumKey], function (err) {
    callback(err, this.changes);
  });
}

// 앨범 삭제
function deleteAlbum(albumKey, callback) {
  db.run('DELETE FROM album WHERE album_key = ?', [albumKey], function (err) {
    callback(err, this.changes);
  });
}

function addMemberToAlbum(albumKey, userkey, callback) {
  // 1. 기존 member 값 읽기
  db.get('SELECT members FROM album WHERE album_key = ?', [albumKey], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error('Album not found'));

    // 2. 기존 값 배열로 변환
    let members = row.members ? row.members.split(',').map(Number) : [];

    // 3. 이미 있으면 아무 것도 하지 않음
    if (members.includes(userkey)) {
      return callback(null, 0); // 변경 없음
    }

    // 4. 추가하고 저장
    members.push(userkey);
    const updated = members.join(',');

    db.run('UPDATE album SET members = ? WHERE album_key = ?', [updated, albumKey], function (err) {
      callback(err, this ? this.changes : 0);
    });
  });
}

module.exports = {
  addAlbum,
  getAllAlbums,
  getAlbumByKey,
  updateAlbum,
  deleteAlbum,
  addMemberToAlbum,
  getAlbumTitleByKey
};
