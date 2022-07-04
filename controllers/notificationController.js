const express = require('express');
const createError = require('../util/createError');
const {
  Follow,
  User,

  Post,
  Comment,
  Notification,
} = require('../models');

exports.getAllNotification = async (req, res, next) => {
  const userId = req.user.id;
  const follow = req.follow.id;
  if (follow) {
    const notification = await Notification.findAll({
      where: { id: userId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: { exclude: ['password'] },
          include: UserDetail,
        },
      ],
    });
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { postId, commentId, jobListId } = req.body;
    const follower = await Follow.findOne({ where: id });
    console.log(follower);
    if (follower) {
      const notification = await Notification.create({
        userId: req.user.id,
        postId,
        commentId,
        jobListId,
      });
      req.status(201).json({ notification });
    }
  } catch (error) {
    next(error);
  }
};
