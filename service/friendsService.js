const { Op } = require('sequelize');
const { Friend, User, UserDetail } = require('../models');
const { FRIEND_ACCEPTED, FRIEND_PENDING } = require('../config/constants');

exports.findFriendId = async (id) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ requestToId: id }, { requestFromId: id }],
      status: FRIEND_ACCEPTED,
    },
  });

  const friendIds = friends.map((el) =>
    el.requestToId === id ? el.requestFromId : el.requestToId,
  );

  return friendIds;
};

exports.findAcceptedFriend = async (id) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ requestToId: id }, { requestFromId: id }],
      status: FRIEND_ACCEPTED,
    },
  });

  const friendIds = friends.map((el) =>
    el.requestToId === id ? el.requestFromId : el.requestToId,
  );

  const users = await User.findAll({
    where: { id: friendIds },
    attributes: { exclude: ['password'] },
    include: { model: UserDetail },
  });

  return users;
};

// find another send request to me
exports.findPendingFriend = async (id) => {
  const friends = await Friend.findAll({
    where: {
      requestToId: id,
      status: FRIEND_PENDING,
    },
    include: {
      model: User,
      as: 'RequestFrom',
      attributes: {
        exclude: ['password'],
      },
      include: UserDetail,
    },
  });
  console.log(friends);
  return friends.map((el) => el.RequestFrom);
};

//find I requested to other and they didnt accept
exports.findRequestFriend = async (id) => {
  const friends = await Friend.findAll({
    where: {
      requestFromId: id,
      status: FRIEND_PENDING,
    },
    include: {
      model: User,
      as: 'RequestTo',
      attributes: {
        exclude: ['password'],
      },
      include: UserDetail,
    },
  });
  return friends.map((el) => el.RequestTo);
};

exports.findUnknown = async (id) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ requestToId: id }, { requestFromId: id }],
    },
  });

  const friendIds = friends.map((el) =>
    el.requestToId === id ? el.requestFromId : el.requestToId,
  );

  friendIds.push(id);

  const users = await User.findAll({
    where: { id: { [Op.notIn]: friendIds } },
    attributes: { exclude: ['password'] },
    include: { model: UserDetail },
  });

  return users;
};
