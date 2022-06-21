const express = require("express");
const router = express.Router();

const skillController = require("../controllers/skillControler");

router.post("/", skillController.createSkill);

router.delete("/ experienceId", skillController.deleteSkill);

module.exports = router;
