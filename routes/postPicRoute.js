const express = require("express");
const router = express.Router();
const postPicController = require("../controllers/postPicController");

router.get("/");
router.post("/", postPicController.createpostPic);
router.put("/:postPicId", postPicController.updatepostPic);
router.delete("/:postPicId", postPicController.deletepostPic);

module.exports = router;
