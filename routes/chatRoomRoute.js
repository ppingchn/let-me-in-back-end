const express = require('express');

const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, chatRoomController.listChatRoomController);
router.post('/', authenticate, chatRoomController.createChatRoomController);

router.delete(
  '/:chatRoomId',
  authenticate,
  chatRoomController.deleteChatRoomController,
);

module.exports = router;
