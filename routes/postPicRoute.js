const express = require("express");
const router = express.Router();
const postPicController = require("../controllers/postPicController");
const authenticate = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.get("/");
router.post(
  "/",
  upload.fields([{ name: "postPic", maxCount: 10 }]),
  authenticate,
  postPicController.createpostPic
);
router.put(
  "/:postPicId",
  upload.fields([{ name: "postPic", maxCount: 10 }]),
  authenticate,
  postPicController.updatepostPic
);

router.delete("/:postPicId", authenticate, postPicController.deletepostPic);

module.exports = router;
