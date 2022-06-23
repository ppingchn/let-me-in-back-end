const express = require("express");
const createError = require("../utils/createError");
exports.createpostPic = async (req, res, next) => {
  try {
    const { postPic } = req.body;
    const picPost = await PostPic.create({ postPic });
    res.status(201).json({ picPost });
  } catch (error) {
    next(error);
  }
};

exports.updatepostPic = async (req, res, next) => {
  try {
    const { postPic } = req.body;
    const { postPicId } = req.params;
    const picPost = await PostPic.findOne({ where: { id: postPicId } });
    if (!picPost) {
      createError("Postpic not found", 404);
    }
    bodyUpdate = { postPic };
    await PostPic.update(bodyUpdate);
    res.json({ picPost });
  } catch (error) {
    next(error);
  }
};
exports.deletepostPic = async () => {
  try {
    const { postpicId } = req.params;
    const picPost = await PostPic.findOne({ where: { id: postpicId } });
    if (!picPost) {
      createError("Post pic not found", 404);
    }
    await picPost.destroy();
    res.status(204).json({ picPost });
  } catch (error) {
    next(error);
  }
};
