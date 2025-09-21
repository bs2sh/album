const express = require('express')
const router = express.Router()

const photoDB = require('../../db/photoDB')


router.post('/photolist', async (req, res) => {
  let { userKey, albumKey, lastPhotoKey } = req.body

  console.log(userKey + " / " + albumKey + ' / ' + lastPhotoKey)


  try {
    // 첫 페이지
    let result = await photoDB.getPhotos(albumKey, lastPhotoKey);
    console.log('전체개수:', result.total);
    console.log('페이지 데이터:', result.data);

    let data = {
      count: result.total,
      list: result.data
    }

    let ret = {
      result: 1,
      msg: '',
      data: data
    }

    res.json(ret)


    // 다음 페이지: 마지막 photokey 사용
    // if (result.data.length === 20) {
    //     let nextCursor = result.data[19].photokey;
    //     let nextResult = await photoDB.getPhotosByCursorWithTotal(albumKey, nextCursor);
    //     console.log('다음 페이지:', nextResult.data);
    // }
  } catch (err) {
    å
    console.error(err);
    res.json({
      result: 0,
      msg: err.message,
      data: null
    })
  }
})

module.exports = router