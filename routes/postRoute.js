const express = require('express');

const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
const postPicController = require('../controllers/postPicController');
const { route } = require('./registerRoute');

router.get('/me', authenticate, postController.getUserPost);
router.get('/postByPage', authenticate, postController.getUserPostByPage);
router.post(
  '/',
  upload.array('postPicArr', 5),
  authenticate,
  postController.createPost,
);
router.put(
  '/:postId',
  upload.array('postPicArr', 5),
  authenticate,
  postController.updatePost,
);
router.delete('/:postId', authenticate, postController.deletePost);

router.delete('/:postPicId', authenticate, postPicController.deletepostPic);
module.exports = router;
