const express = require("express");
const router = express.Router();

const workEnvironmentController = require("../controllers/workEnvironmentController");

router.post("/", workEnvironmentController.createWorkEnvironment);
router.put(
  "/ workEnvironmentId",
  workEnvironmentController.updateWorkEnvironment
);
router.delete(
  "/ workEnvironmentId",
  workEnvironmentController.deleteWorkEnvironment
);

module.exports = router;
