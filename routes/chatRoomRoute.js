const express = require("express");

const router = express.Router();
const chatRoomController = require("../controllers/chatRoomController");

router.get("/");
router.post("/", chatRoomController.createchatRoom);
router.put("/:chatRoomId", chatRoomController.updatechatRoom);
router.delete("/:chatRoomId", chatRoomController.deletechatRoom);

module.exports = router;
