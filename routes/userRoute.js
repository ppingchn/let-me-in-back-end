const express = require('express');
const userController = require('../controllers/userController');

const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/me', userController.getMe);
// router.patch(
//   '/',
//   upload.fields([
//     { name: 'profilePic', maxCount: 1 },
//     { name: 'coverPhoto', maxCount: 1 },
//   ]),
//   userController.updateProfile,
// );
// router.get('/posts', postController.getUserPost);
router.get('/companyByLetter/:letter', userController.getCompanyByLetter);
router.get('/:userId', userController.getUserById);

module.exports = router;
