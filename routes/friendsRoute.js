const express = require('express');

const router = express.Router();
const friendController = require('../controllers/friendController');

router.get('/allUserByLetter', friendController.getAllUserByLetter);
router.get('/', friendController.getAllFriend);
router.get('/:id', friendController.findFriendId);
router.post('/:requestToId', friendController.requestFriend);
router.patch('/:requestFromId', friendController.updateFriend);

router.delete('/:requestFromId', friendController.deleteFriend);

module.exports = router;
