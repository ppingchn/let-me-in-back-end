const express = require('express');

const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
const { route } = require('./registerRoute');
router.post(
  '/',
  upload.fields([{ name: 'postPicArr', maxCount: 5 }]),
  authenticate,
  postController.createPost,
);
router.put(
  '/:postId',
  upload.fields([{ name: 'postPicArray', maxCount: 5 }]),
  authenticate,
  postController.updatePost,
);
router.delete('/:postId', authenticate, postController.deletePost);
router.delete('/:postPicId', authenticate, postController.deletePost);
module.exports = router;
