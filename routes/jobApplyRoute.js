const express = require('express');
const router = express.Router();
const jobApplyController = require('../controllers/jobApplyController');

router.get('/');
router.post('/', jobApplyController.createJobApply);
router.post('/createJobAlert/:companyId', jobApplyController.createJobAlert);
router.put('/:jobApplyId', jobApplyController.updateJobApply);
router.delete('/:jobApplyId', jobApplyController.deleteJobApply);

module.exports = router;
