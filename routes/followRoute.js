const express = require("express");

const router = express.Router();
const followController = require("../controllers/followController");

router.get("/", followController.getAllFollows);
router.post("/", followController.createFollows);
router.delete("/:companyId", followController.deleteFollows);

module.exports = router;
