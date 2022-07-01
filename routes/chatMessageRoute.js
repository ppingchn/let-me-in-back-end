const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatMessageController');

router.get('/');
router.post('/', chatMessageController.createChatMessage);

router.delete('/:chatMessageId', chatMessageController.deleteChatMessage);

module.exports = router;
