const express = require("express");

const router = express.Router();
const joblistController = require("../controllers/joblistController");

router.post("/", joblistController.createJoblist);
router.put("/joblistId", joblistController.updateJoblist);
router.delete("/joblistId", joblistController.deleteJoblist);

module.exports = router;
