const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const createError = require('../util/createError');
const {
  User,
  UserDetail,
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
        firstName,
        lastName,
        birthDate,
        gender,
        phoneNumber,
        educationArray,
        experienceArray,
        skillArray,
        companyName,
        websiteLink,
        detail,
        country,
        houseNumber,
        subDistrict,
        district,
        province,
        postCode,
        location,
        address,
      } = req.body;

      // console.log(birthDate);
      const user = await User.findOne({
        where: { [Op.or]: [{ username }, { email }] },
      });

      if (user) {
        createError('username or email is already used');
      }

      let stockPic = {};

      if (req.files?.profilePic) {
        const result = await cloudinary.upload(req.files.profilePic[0].path);
        stockPic.profilePic = result.secure_url;
      }
      if (req.files?.coverPic) {
        const result = await cloudinary.upload(req.files.coverPic[0].path);
        stockPic.coverPic = result.secure_url;
      }

      if (!phoneNumber) {
        createError('phone number is require', 400);
      }
      if (!password) {
        createError('password is require', 400);
      }
      if (password !== confirmPassword) {
        createError('password did not match', 400);
      }

      if (!country) {
        createError('country is require', 400);
      }
      if (!houseNumber) {
        createError('houseNumber is require', 400);
      }
      if (!subDistrict) {
        createError('subDistrict is require', 400);
      }
      if (!district) {
        createError('district is require', 400);
      }
      if (!province) {
        createError('province is require', 400);
      }
      if (!postCode) {
        createError('postCode is require', 400);
      }

      // Make sure they gave use a valid phone number
      const isPhoneNumber = validator.isMobilePhone(phoneNumber + '');
      if (!isPhoneNumber) {
        createError('Invalid phone number', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      if (role === 'user' || role === 'company') {
        const user = await User.create({
          username,
          profilePic: stockPic.profilePic,
          coverPic: stockPic.coverPic,
          role,
          email,
          phoneNumber,
          detail,
          password: hashedPassword,
          country,
          houseNumber,
          subDistrict,
          district,
          province,
          postCode,
        });

        //create Education
        // console.log('/n/n/n/n =============');
        // console.log(firstName, lastName, birthDate, gender, user.id);
        if (role === 'user') {
          await UserDetail.create({
            firstName,
            lastName,
            birthDate,
            gender,
            userId: user.id,
          });

          const eduArray = Object.values(JSON.parse(educationArray));
          // console.log(eduArray);

          eduArray.map(
            async (el) =>
              await Education.create({
                userId: user.id,
                degree: el.degree,
                university: el.university,
                field: el.field,
                yearStart: el.startDateEducation,
                yearEnd: el.endDateEducation,
              }),
          );

          const experience = Object.values(JSON.parse(experienceArray));
          // console.log(experience);

          experience.map(
            async (el) =>
              await Experience.create({
                companyName: el.companyName,
                position: el.position,
                yearStart: el.startDate,
                yearEnd: el.endDate,
                workDescription: el.workDescription,
                userId: user.id,
              }),
          );

          //////////////////// DONT OPEN THIS ///////////////////////////
          //////////////////// DONT OPEN THIS ///////////////////////////
          //////////////////// DONT OPEN THIS ///////////////////////////
          //////////////////// DONT OPEN THIS ///////////////////////////
          //////////////////// DONT OPEN THIS ///////////////////////////
          //////////////////// DONT OPEN THIS ///////////////////////////
          // const skill = Object.values(JSON.parse(skillArray));

          // skill.map(
          //   async (el) =>
          //     await Skill.create({
          //       title: el.title,
          //       userId: user.id,
          //     }),
          // );
        } else if (role === 'company') {
          await CompanyDetail.create({
            companyName,
            websiteLink,
            address,
            location,
            userId: user.id,
          });
        }
        const token = createToken({ id: user.id });
        res.status(201).json({ token });
      }
    });
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
