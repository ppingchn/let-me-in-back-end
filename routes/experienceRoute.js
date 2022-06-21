const express = require("express");

const router = express.Router();
const experienceController = require("../controllers/experienceController");

router.post("/", experienceController.createExperience);
router.put("/ experienceId", experienceController.updateExperience);
router.delete("/ experienceId", experienceController.deleleExperience);

module.exports = router;
