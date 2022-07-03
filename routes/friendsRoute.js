const express = require('express');

const router = express.Router();
const friendController = require('../controllers/friendController');

router.get('/', friendController.getAllFriend);
router.get('/:id', friendController.findFriendId);
router.post('/', friendController.requestFriend);
router.patch('/:requestFromId', friendController.updateFriend);

//friendId
router.delete('/:id', friendController.deleteFriend);

module.exports = router;
