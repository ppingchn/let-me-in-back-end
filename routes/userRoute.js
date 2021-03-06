const express = require('express');
const userController = require('../controllers/userController');

const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/me', userController.getMe);
router.put(
  '/coverImage',
  upload.single('coverImage'),
  userController.uploadCoverImage,
);
router.put('/updateOverview', userController.editOverviewCompany);
router.put('/updateIntro', userController.editIntro);
// router.get('/posts', postController.getUserPost);
router.get('/allUserByLetter/:letter', userController.getAllUserByLetter);
router.get('/companyByLetter/:letter', userController.getCompanyByLetter);
router.get('/:userId', userController.getUserById);

module.exports = router;
