const express = require('express');

const router = express.Router();
const friendController = require('../controllers/friendController');

router.get('/', friendController.getAllFriend);
router.get('/:id', friendController.findFriendId);
router.post('/', friendController.requestFriend);
router.put('/:requestFromId', friendController.updateFriend);
router.delete('/:id', friendController.deleteFriend);

module.exports = router;