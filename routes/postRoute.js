const express = require('express');

const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, postController.createPost);
router.put('/:postId', authenticate, postController.updatePost);
router.delete('/:postId', authenticate, postController.deletePost);
module.exports = router;
