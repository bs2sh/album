const express = require('express')
const router = express.Router()
const userDB = require('../../db/userDB')

router.post('/info', (req, res) => {
  console.log('/user/info' >> req.body)

  let { userkey } = req.body

  userDB.getUserByKey(userkey, (err, row) => {
    let msg = ''
    let result = 1
    let key = userkey

    if (err != null) {
      result = 0
      msg = err.message
    }

    let resdata = { userKey: row.user_key, nick: row.nick, email: row.email, albums: row.join_albums }
    let ret = { result: result, msg: msg, data: resdata }
    res.json(ret)

  })
})

router.post('/infolist', (req, res) => {
  console.log('/user/infolist' + JSON.stringify(req.body));
  let { userKey, userKeys } = req.body

  userDB.getUsersByKeyString(userKeys, (err, rows) => {
    let msg = ''
    let result = 1

    if (err != null) {
      result = 0
      msg = err.message
    }

    let list = []
    for (let row of rows) {
      console.log('row : ' + row.nick + ' / ' + row.email);
      let info = { userkey: row.user_key, nick: row.nick, email: row.email };
      list.push(info)
    }

    let ret = { result: result, msg: msg, data: list };
    console.log('/infolist response >>' + ret);
    res.json(ret)
  })

})

module.exports = router
