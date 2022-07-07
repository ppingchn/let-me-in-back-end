const express = require('express');

const router = express.Router();
const likeCommentController = require('../controllers/likeCommentController');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, likeCommentController.createLikeComment);

router.delete(
  '/comment/:commentId',
  authenticate,
  likeCommentController.deleteLikeComment,
);

module.exports = router;
