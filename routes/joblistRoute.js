const express = require('express');

const router = express.Router();
const joblistController = require('../controllers/joblistController');
const jobtypeController = require('../controllers/jobTypeController');
const workEnvironmentController = require('../controllers/workEnvironmentController');

router.post(
  '/',
  jobtypeController.createJobType,
  workEnvironmentController.createWorkEnvironment,
  joblistController.createJoblist,
);
router.put('/joblistId', joblistController.updateJoblist);
router.delete('/joblistId', joblistController.deleteJoblist);

module.exports = router;
