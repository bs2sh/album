var express = require('express')
var app = express()
var router = express.Router()

// user
const join = require('./user/join')
const login = require('./user/login')
const joinalbums = require('./user/joinalbums')
const userinfo = require('./user/userinfo')
const usersearch = require('./user/search')

// album
const joinalbum = require('./album/join')
const create = require('./album/create')

// photo
const uploadphoto = require('./photo/upload')
const photolist = require('./photo/photolist')

// invite
const sendInvite = require('./invite/sendInvite')
const inviteList = require('./invite/list')
const inviteUpdate = require('./invite/update')

// 회원가입
router.use('/user', join)
router.use('/user', login)
router.use('/user', joinalbums)
router.use('/user', userinfo)
router.use('/user', usersearch)

router.use('/album', joinalbum)
router.use('/album', create)

router.use('/photo', uploadphoto)
router.use('/photo', photolist)

router.use('/invite', sendInvite)
router.use('/invite', inviteList)
router.use('/invite', inviteUpdate)

module.exports = router