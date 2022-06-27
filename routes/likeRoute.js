const express = require('express');

const router = express.Router();
const likeController = require('../controllers/likeController');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, likeController.createLike);

router.delete(
  '/posts/:postId/likes/:likeId',
  authenticate,
  likeController.deleteLike,
);

module.exports = router;
