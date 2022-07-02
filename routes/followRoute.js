const express = require("express");

const router = express.Router();
const followController = require("../controllers/followController");

router.get("/following", followController.getAllFollowing);
router.get("/follower", followController.getAllFollower);
router.post("/", followController.createFollows);
router.delete("/:id", followController.deleteFollows);

module.exports = router;
