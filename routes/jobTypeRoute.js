const express = require("express");

const router = express.Router();
const jobTypeController = require("../controllers/jobTypeController");

router.post("/", jobTypeController.createJobType);
router.put("/jobTypeId", jobTypeController.updateJobType);
router.delete("/jobTypeId", jobTypeController.deleteJobType);

module.exports = router;
