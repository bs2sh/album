const express = require("express");
const router = express.Router();
const commentDB = require("../../db/commentDB");
const { json } = require("express/lib/response");

router.post("/commentList", (req, res) => {
  console.log("/comment/commentList >>" + JSON.stringify(req.body));

  let { userKey, photoKey } = req.body;

  (async () => {
    try {
      let rows = await commentDB.commentList(photoKey);
      console.log(">>>> " + JSON.stringify(rows));
      let list = [];
      for (row of rows) {
        // rows.forEach(row => {
        let obj = {
          commentKey: row.comment_key,
          ownerKey: row.owner_key,
          ownerNick: row.owner_nick,
          comment: row.comment,
          regdt: row.regdt,
        };

        list.push(obj);
      }
      let ret = {
        result: 1,
        msg: "",
        data: list,
      };
      res.json(ret);
    } catch (error) {
      console.log("0000000000000");
      res.json({
        result: 0,
        msg: error.message,
        data: null,
      });
    }
  })();
});

module.exports = router;
