const express = require("express");

const router = express.Router();
const likeController = require("../controllers/likeController");

router.post("/", likeController.createLike);
router.put("/likeId", likeController.updateLike);
router.delete("/likeId", likeController.deleteLike);

module.exports = router;
