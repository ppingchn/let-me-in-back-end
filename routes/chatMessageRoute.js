const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatMessageController');

router.get('/');
router.post('/', chatMessageController.createChatMessage);
router.put('/:chatMessageId', chatMessageController.updateChatMessage);
router.delete('/:chatMessageId', chatMessageController.deleteChatMessage);

module.exports = router;
