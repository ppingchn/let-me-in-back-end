const express = require('express');

const router = express.Router();
const followController = require('../controllers/followController');

//get
router.get('/following', followController.getAllFollowing);
router.get('/follower', followController.getAllFollower);
router.get('/:companyId', followController.getFollowById);

//post
router.post('/', followController.createFollows);

//delete
router.delete('/:id', followController.deleteFollows);

module.exports = router;
