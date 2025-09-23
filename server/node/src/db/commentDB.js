const sqlite3 = require('sqlite3').verbose();
const db = require('./db')
const userDB = require('./userDB')
const { json } = require('express/lib/response')

/*
comment
- comment_key INT:
- photo_key TEXT: 댓글 등록할 이미지 photo key
- owner_key INT: 작성자 UserKey
- owner_nick TEXT: 작성자 닉네임
- comment TEXT: 댓글 내용
- regdt DOUBLE: 올린 날짜
*/

async function addComment(userKey, comment, photoKey) {
    return new Promise((resolve, reject) => {
			(async () => {


        let userNick = await userDB.getNick(userKey);
				console.log('user nick : ' + userNick);
        let sql = `
            INSERT INTO comment (photo_key, owner_key, owner_nick, comment, regdt)
            VALUES (?, ?, ?, ?, ?)
        `;
        let params = [
            photoKey,
            userKey,
            userNick,
            comment,
            Date.now()
        ];

        db.run(sql, params, function (err) {
            if (err) {
              return reject(err);
            } else {
              return resolve(this.lastID);
            }
        });
			})();
    });
}

async function commentList(photoKey) {
    return new Promise((resolve, reject) => {
				let sql = 'SELECT * FROM comment WHERE photo_key = ? AND enable = 1'
        db.all(sql, [photoKey], (err, rows) => {
					console.log('rows >> ' + JSON.stringify(rows))					
					if (err) {
						return reject(err);
					} else {
						return resolve(rows);
					}
        });
    });
}

async function deleteComment(commentKey) {
    return new Promise((resolve, reject) => {
			let sql = 'UPDATE comment SET enable = 0 WHERE comment_key = ?';
			db.run(sql, [commentKey], function (err) {
				console.log('changes: ' + this.changes);
				if (err) {
					return reject(err)
				} else {
					return resolve(this.changes)
				}
			});
    });
}


module.exports = {
    addComment,
    commentList,
		deleteComment
}
