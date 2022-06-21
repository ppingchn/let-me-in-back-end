const express = require("express");
const router = express.Router();
const jobApplyController = require("../controllers/jobApplyController");

router.get("/");
router.post("/", jobApplyController.createJobApply);
router.put("/:jobApplyId", jobApplyController.updateJobApply);
router.delete("/:jobApplyId", jobApplyController.deleteJobApply);

module.exports = router;
