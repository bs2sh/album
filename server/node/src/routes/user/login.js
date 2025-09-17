const express = require('express')
const router = express.Router()
const helper = require('../../db/userDB')

// 로그인
router.post('/login', (req, res) => {
  let { email, pw } = req.body
  console.log('login >>>> \n' + email + " : " + pw)

  helper.getUserKey(email, pw, (err, row) => {
    let msg = ''
    let result = 1
    let nick = ''
    let userKey = -1
    console.log('login userkey : ' + userKey)

    if (err != null) {
      result = 0
      msg = err.message
    } else if (!err && !row) { // 등록된 사용자 없음
      result = 0
      msg = '등록된 사용자가 없습니다.'
    } else {
      nick = row.nick
      userKey = row.user_key
    }

    let ret = { result: result, msg: msg, userKey: userKey, nick: nick }
    res.json(ret)
  })

})

module.exports = router