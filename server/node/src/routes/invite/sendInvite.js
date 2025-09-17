const express = require('express')
const router = express.Router()
const inviteDB = require('../../db/inviteDB')

// 앨범에 멤버 추가 보내기
router.post('/sendInvite', (req, res) => {
  console.log('/invite/sendInvite >> ' + JSON.stringify(req.body));

  let { albumKey, sendUserKey, recvUserKey, msg } = req.body

  inviteDB.addInvite(albumKey, sendUserKey, recvUserKey, msg, function (err, lastID) {
    console.log('sendInvite >> ' + lastID)

    let errMsg = ''
    let result = 1

    if (err != null) {
      result = 0
      errMsg = err.message
    } else if (lastID == null || lastID == -1) {
      result = 0
      errMsg = '초대하지 못했습니다'
    }

    let data = { inviteKey: lastID }
    let ret = { result: result, msg: errMsg, data: data }
    res.json(ret)
  })
})

module.exports = router