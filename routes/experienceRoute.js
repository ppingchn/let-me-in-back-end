const express = require('express');

const router = express.Router();
const experienceController = require('../controllers/experienceController');

router.get('/:experienceId', experienceController.getExperience);
router.post('/', experienceController.createExperience);
router.put('/:experienceId', experienceController.updateExperience);
router.delete('/:experienceId', experienceController.deleteExperience);

module.exports = router;
