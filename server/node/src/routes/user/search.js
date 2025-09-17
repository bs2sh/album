const express = require('express')
const router = express.Router()
const userDB = require('../../db/userDB')

router.post('/search', (req, res) => {
  console.log('/user/search >> ' + JSON.stringify(req.body))

  let { email } = req.body
  userDB.getUserByEmail(email, (err, rows) => {

    console.log('search >> ' + rows)
    let msg = ''
    let result = 1
    let data = null

    if (err != null) {
      console.log('search error >>' + err)
      result = 0
      msg = err.message
    } else if (!rows || rows.length == 0) {
      result = 0
      msg = '일치하는 사용자가 없습니다'
    } else {
      data = []
      for (let row of rows) {
        let mem = {
          userKey: row.user_key,
          email: row.email,
          nick: row.nick
        }
        data.push(mem)
      }
    }

    let ret = { result: result, msg: msg, data: data }
    res.json(ret)
  })

})

module.exports = router