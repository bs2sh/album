const express = require('express')
const router = express.Router() 
const commentDB = require('../../db/commentDB')
const userDB = require('../../db/userDB')


router.post('/addComment', (req, res) => {
	console.log('/comment/addComment >> ' + JSON.stringify(req.body));

	let { photoKey, userKey, comment } = req.body;
	console.log('++++' + photoKey + ' / ' + comment);

	(async () => {
		try {   
			console.log('>>>>>>>>>>');
			let commentKey = await commentDB.addComment(userKey, comment, photoKey);
			console.log('comment key' + commentKey);
			if (commentKey < 1) {
					res.json({
							result: 0,
							msg: '댓글을 추가하지 못했습니다',
							data: null
					})
					return
			}

			res.json({
					result: 1,
					msg: '',
					data: {
							commentKey: commentKey
					}
			})
		} catch (error) {
			res.json({
				result: 0,
				msg: error.message,
				data: null
			})
		}
	})();

});

module.exports = router