const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createError = require("../util/createError");
const {
  User,
  Education,
  Skill,
  Experience,
  CompanyDetail,
} = require("../models");
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
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email: email },
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
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      if (role === "user" || role === "company") {
        const user = await User.create({
          username,
          profilePic: stockPic.profilePic,
          coverPic: stockPic.coverPic,

          role,
          email,
          phoneNumber,
          password: hashedPassword,
        });

        //create Education
        if (role === "user") {
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
        } else if (role === "company") {
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
    const token = createToken({ id: User.id });
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
