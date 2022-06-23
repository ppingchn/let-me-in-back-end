const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createError = require("../util/createError");
const { User } = require("../models");
const { sequelize } = require("../models");
const fs = require("fs");
const cloudinary = require("../util/cloundinary");

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
      createError("Invalid credential", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createError("Invalid credential", 400);
    }

    const token = createToken({ id: user.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  // const t = await sequelize.transaction();
  console.log("register");
  try {
    const { username, password, confirmPassword, role, email, phoneNumber } =
      req.body;
    console.log(username);
    console.log(phoneNumber);

    const stockPic = {};

    if (req.files?.profilePic) {
      const result = await cloudinary.upload(req.files.profilePic[0].path);
      stockPic.profilePic = result.secure_url;
    }
    if (req.files?.coverPic) {
      const result = await cloudinary.upload(req.files.coverPic[0].path);
      stockPic.coverPic = result.secure_url;
    }

    if (!phoneNumber) {
      createError("phone number is require", 400);
    }
    if (!password) {
      createError("password is require", 400);
    }
    if (password !== confirmPassword) {
      createError("password did not match", 400);
    }

    const isPhoneNumber = validator.isMobilePhone(phoneNumber + "");
    if (!isPhoneNumber) {
      createError("Invalid phone number", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      profilePic: stockPic.profilePic,
      coverPic: stockPic.coverPic,

      role,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    // await t.commit();
    const token = createToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    // await t.rollback();
    next(err);
  } finally {
    if (req.files?.profilePic) {
      fs.unlinkSync(req.files.profilePic[0].path);
    }
    if (req.files?.coverPic) {
      fs.unlinkSync(req.files.coverPic[0].path);
    }
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
