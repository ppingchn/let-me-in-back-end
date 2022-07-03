const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatMessageController');
const authenticate = require('../middlewares/authenticate');

router.get(
  '/chatRoom/:chatRoomId',
  authenticate,
  chatMessageController.listChatMessageController,
);

router.post(
  '/chatRoom/:chatRoomId',
  authenticate,
  chatMessageController.createChatMessage,
);

router.delete(
  '/:chatMessageId',
  authenticate,
  chatMessageController.deleteChatMessage,
);

module.exports = router;
