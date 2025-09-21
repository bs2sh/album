const express = require('express')
const router = express.Router()
const commentDB = require('../../db/commentDB')

router.post('/deleteComment', (req, res) => {
    console.log('/comment/deleteComment' + JSON.stringify(req.body));
    let { commentKey } = req.body;

    (async () => {
        try {
            let changes = await commentDB.deleteComment(commentKey)
            if (changes < 1) {  // 변경된게 없음
                res.json({
                    result: 0,
                    msg: '삭제할 댓글이 존재하지 않습니다',
                    data: null
                })
                return
            }
            res.json({
                result: 1,
                msg: '',
                data: null
            })

        } catch (error) {
            console.log('delete comment error : ' + error.message);
            res.json({
                result: 0,
                msg: error.message,
                data: null
            })
        }
    })();
    

})

module.exports = router