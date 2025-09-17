const express = require('express')
const router = express.Router()
const helper = require('../../db/userDB')

// 회원가입.

router.post('/join', (req, res) => {

  console.log(req.body)
  let { email, pw, nick } = req.body
  console.log('/join >> ' + email + ' / ' + pw + ' / ' + nick)
  var msg = ''
  var result = 1
  helper.addUser(email, pw, nick, (err, lastID) => {
    if (err != null) {

      if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('user.email')) {
        msg = '이미 등록된 이메일입니다.'
      } else if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('user.nick')) {
        msg = '이미 사용중인 닉네임입니다.'
      } else {
        msg = err.message
      }

      console.log('addUser error : ' + err.message)
      console.log(msg)
      result = 0
    }
    console.log('DB insert : ' + lastID)

    let ret = { result: result, msg: msg }
    console.log(ret)
    res.json(ret)
  })

})

module.exports = router