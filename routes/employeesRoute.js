const express = require("express");

const router = express.Router();
const employeesController = require("../controllers/employeesController");

router.post("/", employeesController.createEmployees);
router.put("/ employeesId", employeesController.updateEmployees);
router.delete("/ employeesId", employeesController.deleteEmployees);

module.exports = router;
