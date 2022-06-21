const express = require("express");

const router = express.Router();
const educationController = require("../controllers/educationController");

router.post("/", educationController);
router.put("/educationId", educationController.updateEducation);
router.delete("/educattionId", educationController.deleleEducation);

module.exports = router;
