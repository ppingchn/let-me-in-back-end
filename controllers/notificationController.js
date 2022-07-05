const express = require('express');
const createError = require('../util/createError');
const { followId } = require('../service/followService');
const {
  User,

  Post,
  Comment,
  JobList,
  Notification,
} = require('../models');

exports.getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const followIds = await followId(userId);
    const notifications = await Notification.findAll({
      where: { userId: followIds },
      include: [
        {
          model: User,
          as: 'User',
          attributes: { exclude: ['password'] },
        },
        {
          model: Post,
          as: 'Post',
        },
        {
          model: Comment,
          as: 'Comment',
        },
        {
          model: JobList,
          as: 'JobList',
        },
      ],
    });
    res.status(201).json({ notifications });
  } catch (error) {
    next(error);
  }
};
