const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = require('./db')
const albumDB = require('./albumDB');
const userDB = require('./userDB');
const { json } = require('express/lib/response');

function addInvite(albumKey, sendUserKey, recvUserKey, msg, callback) {
  let sql = 'INSERT INTO invite (album_key, send_user_key, recv_user_key, msg) VALUES (?, ?, ?, ?)';
  db.run(sql, [albumKey, sendUserKey, recvUserKey, msg], function (err) {
    if (err) {
      callback(err, -1);
      return
    }
    callback(null, this.lastID)
  })
}

function getSendInvite(sendUserKey, callback) {
  let sql = 'SELECT * FROM invite WHERE send_user_key = ?';
  db.all(sql, [sendUserKey], function (err, rows) {
    if (err) {
      callback(err, null);
    } else if (!rows) {
      callback(null, [])
    } else {
      (async () => {
        try {
          let list = [];
          for (let row of rows) {
            // console.log('++ send invite row: ' + JSON.stringify(row));
            let albumTitle = await albumDB.getAlbumTitleByKey(row.album_key);
            let recvUserNick = await userDB.getNick(row.recv_user_key);
            let inviteObj = {
              albumKey: row.album_key,
              inviteKey: row.invite_key,
              albumTitle: albumTitle,
              recvUserKey: row.recv_user_key,
              recvUserNick: recvUserNick,
              state: row.state
            };
            list.push(inviteObj);
          }
          callback(null, list);
        } catch (error) {
          console.error('Error : ', error);
          let err = new Error('앨범 정보를 가져올 수 없습니다.')
          callback(err, null);
        }
      })();
    }
  })
}

function getReceiveInvite(recvUserKey, callback) {
  let sql = 'SELECT * FROM invite WHERE recv_user_key = ?';
  db.all(sql, [recvUserKey], function (err, rows) {
    if (err) {
      callback(err, null);
    } else if (!rows) {
      callback(null, [])
    } else {
      (async () => {
        try {
          let list = [];
          for (let row of rows) {
            console.log('-- receive invite row: ' + JSON.stringify(row));
            console.log('((((((((( invite key : ' + row.invite_key);
            let albumTitle = await albumDB.getAlbumTitleByKey(row.album_key);
            let sendUserNick = await userDB.getNick(row.send_user_key);
            console.log('))))))))))) invite key : ' + row.invite_key);
            let inviteObj = {
              inviteKey: row.invite_key,
              albumKey: row.album_key,
              albumTitle: albumTitle,
              sendUserKey: row.send_user_key,
              sendUserNick: sendUserNick,
              state: row.state
            };
            list.push(inviteObj);
          }
          callback(null, list);
        } catch (error) {
          console.error('Error : ', error);
          let err = new Error('앨범 정보를 가져올 수 없습니다.')
          callback(err, null);
        }
      })();
    }
  })
}

function getInfoFromReceiveInvite(inviteKey, callback) {
  let sql = 'SELECT album_key, recv_user_key FROM invite WHERE invite_key = ?';
  db.get(sql, [inviteKey], function (err, row) {
    if (err) {
      callback(err, null);
    } else if (!row) {
      callback(null, [])
    } else {
      (async () => {
        try {
          console.log('invite info: ' + JSON.stringify(row));
          let inviteObj = {
            albumKey: row.album_key,
            recvUserKey: row.recv_user_key,
            state: row.state
          };
          callback(null, inviteObj);

        } catch (error) {
          console.error('Error : ', error);
          let err = new Error('앨범 정보를 가져올 수 없습니다.')
          callback(err, null);
        }
      })();
    }
  });
}

function updateInviteState(inviteKey, state, callback) {
  let sql = 'UPDATE invite SET state = ? WHERE invite_key = ?';
  db.run(sql, [state, inviteKey], function (err) {
    console.log('changes ;' + this.changes);
    callback(err, this.changes);
  })
}

module.exports = {
  addInvite,
  getSendInvite,
  getInfoFromReceiveInvite,
  getReceiveInvite,
  updateInviteState
}
//초대 추가
// 수락 / 거부
// 내가 받은 초대 리스트
// 내가 보낸 초대 리스트