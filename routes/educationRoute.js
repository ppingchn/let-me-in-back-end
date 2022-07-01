const express = require('express');

const router = express.Router();
const educationController = require('../controllers/educationController');

router.get('/:id', educationController.getEducationById);
router.post('/', educationController.createEducation);
router.put('/:educationId', educationController.updateEducation);
router.delete('/:educationId', educationController.deleleEducation);

module.exports = router;
