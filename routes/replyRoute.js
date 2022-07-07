const express = require('express');

const router = express.Router();
const replyController = require('../controllers/replyController');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, replyController.createReply);
router.put('/:replyId', authenticate, replyController.updateReply);
router.delete('/:replyId', authenticate, replyController.deleteReply);

module.exports = router;
