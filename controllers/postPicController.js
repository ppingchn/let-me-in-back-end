const express = require('express');
const { PostPicture, Post } = require('../models');
const createError = require('../util/createError');

const fs = require('fs');
const cloudinary = require('../util/cloundinary');
const { sequelize } = require('../models');
exports.createpostPic = async (req, res, next) => {
  try {
    if (req.files?.postPic) {
      const userId = req.user.id;
      const result = await cloudinary.upload(req.files.postPic[0].path);
      const postPic = result.secure_url;
      const { postId } = req.body;
      const post = Post.findOne({ where: { id: postId, userId } });
      if (!post) {
        createError('No permissions', 403);
      }
      const picPost = await PostPicture.create({ postPic, postId, userId });
      res.status(201).json({ picPost });
    } else {
      createError('no file found', 400);
    }
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.updatepostPic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { postPicId } = req.params;
    const postPic = await PostPicture.findOne({
      where: { id: postPicId, userId },
    });
    if (!postPic) {
      createError('Postpic not found', 404);
    }
    if (req.files?.postPic) {
      const split = postPic.postPic.split('/');
      const publicId = split[split.length - 1].split('.')[0];
      await cloudinary.destroy(publicId);
      const result = await cloudinary.upload(req.files.postPic[0].path);
      const urlpostPic = result.secure_url;
      postPic.postPic = urlpostPic;
      await postPic.save();
      res.json({ postPic });
    } else {
      createError('no file found', 400);
    }
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
exports.deletepostPic = async (req, res, next) => {
  try {
    t = await sequelize.transaction();
    const { postPicId } = req.params;

    const postPic = await PostPicture.findOne({ where: { id: postPicId } });
    if (!postPic) {
      createError('Post pic not found', 404);
    }
    const post = await Post.findOne({ where: { id: postPic.postId } });
    console.log(post);
    if (post.userId !== req.user.id) {
      createError('you have no permission', 403);
    }

    await postPic.destroy({ where: { id: postPicId } }, { transaction: t });
    await t.commit();
    res.status(204).json({ postPic });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
