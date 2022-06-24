const express = require("express");

const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../middlewares/upload");

router.post(
  "/",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  authController.register
);

module.exports = router;
