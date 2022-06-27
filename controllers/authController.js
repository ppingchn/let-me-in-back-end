const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createError = require('../util/createError');
const {
  User,
  Education,
  Skill,
  Experience,
  CompanyDetail,
} = require('../models');
const { sequelize } = require('../models');
const fs = require('fs');
const cloudinary = require('../util/cloundinary');

//CREATE TOKEN
const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username: username },
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
    const result = await sequelize.transaction(async (t) => {
      const {
        username,
        password,
        confirmPassword,
        role,
        email,
        phoneNumber,
        educationArray,
        experienceArray,
        skillArray,
        companyName,
        websiteLink,
        overView,
        address,
        location,
      } = req.body;

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
<<<<<<< HEAD
        createError("phone number is require", 400);
      }
      if (!password) {
        createError("password is require", 400);
      }
      if (password !== confirmPassword) {
        createError("password did not match", 400);
      }

      // Make sure they gave use a valid phone number
      const isPhoneNumber = validator.isMobilePhone(phoneNumber + "");
      if (!isPhoneNumber) {
        createError("Invalid phone number", 400);
=======
        createError('phone number is require', 400);
      }
      if (!password) {
        createError('password is require', 400);
      }
      if (password !== confirmPassword) {
        createError('password did not match', 400);
      }

      // Make sure they gave use a valid phone number
      const isPhoneNumber = validator.isMobilePhone(phoneNumber + '');
      if (!isPhoneNumber) {
        createError('Invalid phone number', 400);
>>>>>>> dev
      }

      const hashedPassword = await bcrypt.hash(password, 12);

<<<<<<< HEAD
      if (role === "user" || role === "company") {
=======
      if (role === 'user' || role === 'company') {
>>>>>>> dev
        const user = await User.create({
          username,
          profilePic: stockPic.profilePic,
          coverPic: stockPic.coverPic,
<<<<<<< HEAD

=======
>>>>>>> dev
          role,
          email,
          phoneNumber,
          password: hashedPassword,
        });

        //create Education
<<<<<<< HEAD
        if (role === "user") {
=======
        if (role === 'user') {
>>>>>>> dev
          const eduArray = JSON.parse(educationArray);

          eduArray.map(
            async (el) =>
              await Education.create({
                userId: user.id,
                degree: el.degree,
                university: el.university,
                field: el.field,
                yearStart: el.yearStart,
                yearEnd: el.yearEnd,
              })
          );

          const experience = JSON.parse(experienceArray);

          experience.map(
            async (el) =>
              await Experience.create({
                companyName: el.companyName,
                position: el.position,
                yearStart: el.yearStart,
                yearEnd: el.yearEnd,
                userId: user.id,
              })
          );

          const skill = JSON.parse(skillArray);

          skill.map(
            async (el) =>
              await Skill.create({
                title: el.title,
                userId: user.id,
              })
          );
<<<<<<< HEAD
        } else if (role === "company") {
=======
        } else if (role === 'company') {
>>>>>>> dev
          await CompanyDetail.create({
            companyName,
            websiteLink,
            overView,
            address,
            location,
            userId: user.id,
          });
        }
      }
    });
<<<<<<< HEAD
    const token = createToken({ id: user.id });
=======
    const token = createToken({ id: User.id });
>>>>>>> dev
    res.status(201).json({ token });
  } catch (err) {
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
