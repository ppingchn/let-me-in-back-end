const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createError = require('../util/createError');
const { User } = require('../models');
const sequelize = require('sequelize');

//CREATE TOKEN
const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({
      where: { userName },
    });

    if (!user) {
      createError('Invalid credential', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createError('Invalid credential', 400);
    }

    const token = createToken({ id: user.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { userName, phoneNumber, password, confirmPassword } = req.body;

    if (!phoneNumber) {
      createError('phone number is require', 400);
    }
    if (!password) {
      createError('password is require', 400);
    }
    if (password !== confirmPassword) {
      createError('password did not match', 400);
    }

    const isPhoneNumber = validator.isMobilePhone(phoneNumber + '');
    if (!isPhoneNumber) {
      createError('Invalid phone number', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      userName,
      phoneNumber,
      password: hashedPassword,
    });

    const token = createToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
exports.companyRegister = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.userRegister = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
