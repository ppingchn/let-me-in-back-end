const express = require("express");

const router = express.Router();
const likeCommentController = require("../controllers/likeCommentController");

router.post("/", likeCommentController.createLikeComment);
router.put("/likeCommentId", likeCommentController.updateLikeComment);
router.delete("/likeCommentId", likeCommentController.deleteLikeComment);

module.exports = router;
