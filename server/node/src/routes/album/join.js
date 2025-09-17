const express = require('express')
const router = express.Router()
const helper = require('../../db/userDB')

router.post('/joinalbum', (res, req) => {
  console.log('/user/joinalbum' + req.body)



})

module.exports = router