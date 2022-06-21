const express = require("express");

const router = express.Router();
const replyController = require("../controllers/replyController");

router.post("/", replyController.createReply);
router.put("/replyId", replyController.updateReply);
router.delete("/replyId", replyController.deleteReply);

module.exports = router;
