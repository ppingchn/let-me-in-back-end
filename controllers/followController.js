const express = require('express');
const createError = require('../util/createError');
const { Follow, User, Company } = require('../models');
const { Op } = require('sequelize');

exports.getAllFollows = async (req, res, next) => {
  try {
    const userId = req.user.Id
    const follow = await Follow.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: User,
          as: 'Employee',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'Company',
          attributes: {
            exclude: ['password'],
          },
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
    const userId = req.user.Id
    const { companyId } = req.body;
    const follow = await Follow.create({ userId, companyId });
    res.status(201).json({ follow });
  } catch (error) {
    next(error);
  }
};

exports.deleteFollows = async (req, res, next) => {
  try {
      const userId = req.user.Id
    const { companyId } = req.params;
    const company = await Follow.findOne({
      where: { [Op.and]: [{ companyId }, { userId}] },
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
