const { create } = require('domain');
const fs = require('fs');
const { Op } = require('sequelize');
const { User, Friend, UserDetail, CompanyDetail } = require('../models');
const FriendService = require('../service/friendsService');
const cloudinary = require('../util/cloundinary');

const createError = require('../util/createError');

exports.getMe = async (req, res) => {
  const user = JSON.parse(JSON.stringify(req.user));

  const userDetail = await UserDetail.findOne({ userId: user.id });
  user.userDetail = userDetail;
  res.json({ user });
};

exports.editIntro = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      firstName,
      lastName,
      houseNumber,
      subDistrict,
      district,
      province,
      country,
      postCode,
      email,
    } = req.body;

    const user = await User.update(
      {
        firstName,
        lastName,
        country,
        houseNumber,
        subDistrict,
        district,
        province,
        postCode,
        email,
      },
      { where: { id } },
    );

    const userDetail = await UserDetail.update(
      { firstName, lastName },
      {
        where: { userId: id },
      },
    );

    res.json({ user, userDetail });
  } catch (err) {
    next(err);
  }
};

exports.getCompanyByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;

    const companies = await CompanyDetail.findAll({
      where: { companyName: { [Op.like]: `%${letter}%` } },
    });

    res.json({ companies });
  } catch (err) {
    next(err);
  }
};

exports.editOverviewCompany = async (req, res, next) => {
  try {
    const { overview, websiteLink } = req.body;
    const { id } = req.user;

    if (!overview && !websiteLink) {
      createError('Overview and website link is empty.', 400);
    }

    const company = await CompanyDetail.update(
      { overview, websiteLink },
      {
        where: { userId: id },
      },
    );

    res.json({ company });
  } catch (err) {
    next(err);
  }
};

exports.getAllUserByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;

    const user = await UserDetail.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${letter}%` } },
          { lastName: { [Op.like]: `%${letter}%` } },
        ],
      },
      limit: 10,
    });

    const companies = await CompanyDetail.findAll({
      where: { companyName: { [Op.like]: `%${letter}%` } },
      limit: 10,
    });

    res.json({ user, companies });
  } catch (err) {
    next(err);
  }
};

exports.getUserByMostFollow = async (req, res, next) => {
  try {
    const { letter } = req.params;

    const companies = await CompanyDetail.findAll({
      where: { companyName: { [Op.like]: `%${letter}%` } },
    });

    res.json({ companies });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      createError('user not found', 400);
    }
    const result = JSON.parse(JSON.stringify(user));

    const userDetail = await UserDetail.findOne({ where: { userId } });
    result.userDetail = userDetail;

    const companyDetail = await CompanyDetail.findOne({ where: { userId } });
    result.companyDetail = companyDetail;

    const friends = await FriendService.findAcceptedFriend(user.id);
    result.friends = friends;

    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestToId: user.id, requestFromId: req.user.id },
          { requestToId: req.user.id, requestFromId: user.id },
        ],
      },
    });
    result.friendStatus = friend;
    res.json({ user: result });
  } catch (err) {
    next(err);
  }
};

exports.uploadCoverImage = async (req, res, next) => {
  try {
    // console.log(req);
    if (req.file) {
      const { id } = req.user;

      const result = await cloudinary.upload(req.file.path);
      const postPic = result.secure_url;

      const coverImage = User.update({ coverPic: postPic }, { where: { id } });

      res.status(201).json({ coverImage });
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
