const fs = require('fs');
const { Op } = require('sequelize');
const { User, Friend, UserDetail, CompanyDetail } = require('../models');
const FriendService = require('../service/friendsService');

const createError = require('../util/createError');

exports.getMe = async (req, res) => {
  const user = JSON.parse(JSON.stringify(req.user));

  res.json({ user });
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
