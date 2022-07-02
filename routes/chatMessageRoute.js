const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatMessageController');
const authenticate = require('../middlewares/authenticate');
router.get('/:chatMessageId', chatMessageController.getMessage);

router.post(
  '/:receiverId',
  authenticate,
  chatMessageController.createChatMessage,
);

router.delete(
  '/:chatMessageId',
  authenticate,
  chatMessageController.deleteChatMessage,
);

module.exports = router;
