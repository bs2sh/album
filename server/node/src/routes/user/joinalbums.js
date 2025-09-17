const express = require('express')
const router = express.Router()
const userDB = require('../../db/userDB')
/*
router.post('/joinalbums', (req, res) => {
  (async () => {
    try {
      let { userkey } = req.body
      const albums = await userDB.getAlbumsByUserKey(userkey);
      console.log(albums);

      let ret = { restult: 1, msg: '', albums: albums }
      res.json(ret)
    } catch (err) {
      console.error('Error:', err);
      let ret = { result: 0, msg: err.message, albums: null }
      res.json(ret)
    }
  })();
})
  */

// userkey가 속해있는 앨범 리스트

router.post('/joinalbums', (req, res) => {
    let { userkey } = req.body
    console.log('/user/joinalbums >> ' + userkey)

    userDB.joinalbums(userkey, (err, albums) => {
        let msg = ''
        let result = 1

        if (err != null) {
            console.log('/user/joinalbums Error >> ' + err.message)
            result = 0
            msg = err.message
        }

        let ret = { result: result, msg: msg, albums: albums }
        res.json(ret)
    })
})
 
module.exports = router