const express = require('express');
const createError = require('../util/createError');
const { Follow, User, CompanyDetail, UserDetail } = require('../models');
const { Op } = require('sequelize');

exports.getAllFollowing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const follow = await Follow.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: {
            exclude: ['password'],
          },
          include: UserDetail,
        },
        {
          model: User,
          as: 'Company',
          attributes: {
            exclude: ['password'],
          },
          include: CompanyDetail,
        },
        {
          model: User,
          as: 'FollowerUser',
          attributes: {
            exclude: ['password'],
          },
          include: UserDetail,
        },
      ],
    });

    res.json({ follow });
  } catch (err) {
    next(err);
  }
};

exports.getAllFollower = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const follow = await Follow.findAll({
      where: {
        followerId: userId,
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: {
            exclude: ['password'],
          },
          include: UserDetail,
        },
        {
          model: User,
          as: 'Company',
          attributes: {
            exclude: ['password'],
          },
          include: CompanyDetail,
        },
        {
          model: User,
          as: 'FollowerUser',
          attributes: {
            exclude: ['password'],
          },
          include: UserDetail,
        },
      ],
    });

    res.json({ follow });
  } catch (err) {
    next(err);
  }
};

exports.createFollows = async (req, res, next) => {
  try {
    const { id } = req.body;

    const follower = await User.findOne({
      where: { id },
    });

    if (req.user.id == id) {
      createError('Cannot follow yourself.');
    } else {
      if (follower.role === 'user') {
        const follow = await Follow.create({
          userId: req.user.id,
          followerId: id,
        });
        res.status(201).json({ follow });
      } else if (follower.role === 'company') {
        const follow = await Follow.create({
          userId: req.user.id,
          companyId: id,
        });
        res.status(201).json({ follow });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteFollows = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { companyId } = req.params;
    const company = await Follow.findOne({
      where: { [Op.and]: [{ companyId }, { userId }] },
    });
    if (!company) {
      createError('Company not found', 404);
    }
    await company.destroy();
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
