const express = require('express')
const router = express.Router()
const inviteDB = require('../../db/inviteDB')
const { json } = require('express/lib/response')

router.post('/sendList', (req, res) => {
  console.log('/invite/sendList >> ' + JSON.stringify(req.body))
  let { sendUserKey } = req.body;
  inviteDB.getSendInvite(sendUserKey, function(err, list) {
    if (err) {
      res.json({
        result: 0,
        msg: err.message,
        data: []
      })
    } else if (!list) {
      res.json({
        result: 0,
        msg: '초대 리스트 오류',
        data: []
      });
    } else {
      res.json({
        result: 1,
        msg: '',
        data: list
      });
    }
  });

  
})

router.post('/receiveList', (req, res) => {
  console.log('/invite/recveList >> ' + JSON.stringify(req.body));
  let { recvUserKey } = req.body
  
  inviteDB.getReceiveInvite(recvUserKey, function(err, list) {
    // console.log(' >>>>>>>>>>>>> ' + JSON.stringify(list));
    for (row of list) {
      console.log('list.js >>>> invite key : ' + row.inviteKey);
    }

    if (err) {
      res.json({
        result: 0,
        msg: err.message,
        data: []
      })
    } else if (!list) {
      res.json({
        result: 0,
        msg: '초대 리스트 오류',
        data: []
      });
    } else {
      res.json({
        result: 1,
        msg: '',
        data: list
      });
    }
  });
})

module.exports = router
