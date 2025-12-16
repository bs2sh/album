const express = require("express");
const router = express.Router();
const userDB = require("../../db/userDB");
const tokenDB = require("../../db/tokenDB");

router.post("/updatetoken", (req, res) => {
  console.log("/user/updatetoken >> " + JSON.stringify(req.body));
  let { userKey, device, token } = req.body;

  (async () => {
    try {
      const ret = await tokenDB.upsertToken(userKey, device, token);
      console.log(ret);
      if (ret.changedRows != 0) {
        res.json({ result: 1, msg: "" });
      } else {
        res.json({ result: 0, msg: "업데이트 되지 않았습니다." });
      }
    } catch (err) {
      console.error("Error:", err);
      res.json({ result: 0, msg: err.message });
    }
  })();
});

module.exports = router;
