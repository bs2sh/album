const express = require('express')
const router = express.Router()
const helper = require('../../db/albumDB')
const userDB = require('../../db/userDB')

router.post('/create', (req, res) => {
  let { userKey, title } = req.body
  console.log('/album/create >> ' + userKey + ' : ' + title)

  // DB에 앨범 추가한다.
  helper.addAlbum(title, [userKey], userKey, 1, (err, albumKey) => {
    let msg = ''
    let result = 1
    if (err != null) {
      console.log('addAlbum Error >> ' + err + ' // ' + err.message)
      if (err.code == 'SQLITE_CONSTRAINT' && err.message.includes('album.title')) {
        msg = '이미 사용중인 앨범이름 입니다.'
      } else {
        msg = err.message
      }
      result = 0
      albumKey = ''
      sendJson(result, msg, albumKey, res)
      return
    }

    if (albumKey != null && albumKey.length > 0) {  // 앨범 생성했다. user 테이블에 참여중인 album 추가한다.
      userDB.appendToAlbumKey(userKey, albumKey, (err, changes) => {
        console.log("album key 추가 >> \n" + changes)
        console.log('Album Create :: ' + albumKey)
        sendJson(result, msg, albumKey, res)
      })
    } else {
      result = 0
      msg = '앨범 생성에 실패했습니다.'
      sendJson(result, msg, albumKey, res)
    }

    // let ret = { result : result, msg : msg, albumkey : albumkey}
    // console.log('/album/create > response \n' + ret)
    // res.json(ret)
  })
})

function sendJson(result, msg, albumKey, res) {
  let ret = { result: result, msg: msg, albumKey: albumKey }
  res.json(ret)
}

module.exports = router


