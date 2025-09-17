const express = require('express')
const router = express.Router()
const inviteDB = require('../../db/inviteDB')
const userDB = require('../../db/userDB')
const albumDB = require('../../db/albumDB')

router.post('/update', (req, res) => {
  console.log('/invite/update >>' + JSON.stringify(req.body));
  let { inviteKey, state } = req.body;

  // inviteDB에서 수락/거절 상태 업데이트
  inviteDB.updateInviteState(inviteKey, state, function (err1, changges) {
    console.log('>>>>> ' + JSON.stringify(changges));
    if (err1 != null) {
      res.json({
        result: 0,
        msg: err1.message
      });
    } else {
      if (state == 2) { // 거절했음. 아래의 변경들은 필요없음.
        res.json({
          result: 1,
          msg: '',
          data: null
        });
        return;
      }

      // 상태 변경 성공. userDB에 albumKey 추가한다.
      // 초대 정보에서 userKey, albumKey 가져온다.
      inviteDB.getInfoFromReceiveInvite(inviteKey, (err2, row) => {
        if (err2) {
          res.json({
            result: 0,
            msg: err2.message,
            data: null
          })
          return
        }

        let userKey = row.recvUserKey;
        let albumKey = row.albumKey;
        // album.members에 userKey 추가.
        albumDB.addMemberToAlbum(albumKey, userKey, (err3, changes) => {
          if (err3) {
            res.json({
              result: 0,
              msg: err3.message,
              data: null
            });
          } else  {
            res.json({
              result: 1,
              msg: '',
              data: null
            })
          }
        })
      })
    }
  });
});

module.exports = router;