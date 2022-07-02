const { Op } = require('sequelize');
const { Friend, User, Follow } = require('../models');
const { FRIEND_ACCEPTED, FRIEND_PENDING } = require('../config/constants');
const FriendService = require('../service/friendsService');
const createError = require('../util/createError');

exports.getAllFriend = async (req, res, next) => {
  try {
    const { status } = req.query;
    console.log(status);
    let users = [];
    if (status?.toUpperCase() === 'UNKNOWN') {
      // **** FIND UNKNOWN
      users = await FriendService.findUnknown(req.user.id);
    } else if (status?.toUpperCase() === 'PENDING') {
      // **** FIND PENDING FRIEND
      users = await FriendService.findPendingFriend(req.user.id);
    } else if (status?.toUpperCase() === 'REQUESTED') {
      // *** FIND REQUESTED FRIEND
      users = await FriendService.findRequestFriend(req.user.id);
    } else {
      // *** FIND ACCEPTED FRIEND
      users = await FriendService.findAcceptedFriend(req.user.id);
    }

    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.findFriendId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === +id) {
      createError('cannot request yourself', 400);
    }

    // const existFriend = await Friend.findOne({
    //   where: {
    //     [Op.or]: [
    //       { requestFromId: req.user.id, requestToId: requestToId },
    //       { requestFromId: requestToId, requestToId: req.user.id },
    //     ],
    //   },
    // });

    // console.log(existFriend);
    // if (!existFriend) {
    //   createError('this user is not a friend yet', 400);
    // }

    // const friends = await Friend.findAll({
    //   where: {
    //     [Op.and]: [
    //       { requestToId: requestToId },
    //       { requestFromId: req.user.id },
    //     ],
    //     status: FRIEND_ACCEPTED,
    //   },
    // });

    const friends = await Friend.findAll({
      where: {
        [Op.or]: [{ requestToId: id }, { requestFromId: id }],

        status: FRIEND_ACCEPTED,
      },
    });
    // const friendIds = friends.map((el) =>
    //   el.requestToId === id ? el.requestFromId : el.requestToId,
    // );

    res.json({ friends });
  } catch (err) {
    next(err);
  }
};

exports.requestFriend = async (req, res, next) => {
  try {
    const { requestToId } = req.params;

    if (req.user.id === +requestToId) {
      createError('cannot request yourself', 400);
    }

    const existFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestFromId: req.user.id, requestToId: requestToId },
          { requestFromId: requestToId, requestToId: req.user.id },
        ],
      },
    });

    if (existFriend) {
      createError('this user has already been requested', 400);
    }

    const friend = await Friend.create({
      requestToId,
      requestFromId: req.user.id,
      status: FRIEND_PENDING,
    });
    res.json({ friend });
  } catch (err) {
    next(err);
  }
};

exports.updateFriend = async (req, res, next) => {
  try {
    const { requestFromId } = req.params;
    const friend = await Friend.findOne({
      where: {
        requestToId: req.user.id,
        requestFromId,
        status: FRIEND_PENDING,
      },
    });

    if (!friend) {
      createError('friend request not found', 400);
    }

    friend.status = FRIEND_ACCEPTED;
    await friend.save();

    const follower = await User.findOne({
      where: { id: requestFromId },
    });

    if (req.user.id == requestFromId) {
      createError('Cannot follow yourself.');
    } else {
      if (follower.role === 'user') {
        const follow = await Follow.create({
          userId: requestFromId,
          followerId: req.user.id,
        });
        res.json({ message: 'friend request accepted' });
        // res.status(201).json({ follow });
      }
    }

    // await Friend.update({ status: FRIEND_ACCEPTED }, { where: { id: friend.id } })
  } catch (err) {
    next(err);
  }
};

exports.deleteFriend = async (req, res, next) => {
  try {
    const { requestFromId } = req.params;

    const friend = await Friend.findOne({
      where: { [Op.and]: [{ requestFromId }, { requestToId: req.user.id }] },
    });

    if (!friend) {
      createError('friend request not found', 400);
    }

    if (
      friend.requestFromId !== req.user.id &&
      friend.requestToId !== req.user.id
    ) {
      createError('you have no permission', 403);
    }

    await friend.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
