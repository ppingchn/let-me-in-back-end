const express = require("express");

const router = express.Router();
const friendController = require("../controllers/friendController");

router.post("/", friendController.createFriends);
router.put("/ friendsId", friendController.updateFriends);
router.delete("/ friendsId", friendController.deleteFriends);

module.exports = router;
