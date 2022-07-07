const { Op } = require('sequelize');
const { Friend, User, Follow, UserDetail } = require('../models');
const { FRIEND_ACCEPTED, FRIEND_PENDING } = require('../config/constants');
const FriendService = require('../service/friendsService');
const createError = require('../util/createError');
const e = require('express');

exports.getAllUserByLetter = async (req, res, next) => {
  try {
    const { letter, sort } = req.query;
    // console.log(letter);
    // console.log(typeof letter);
    // console.log(sort);

    if (sort?.toUpperCase() === 'RECENTLY ADDED') {
      const friends = await Friend.findAll({
        where: {
          [Op.or]: [
            { requestToId: req.user.id },
            { requestFromId: req.user.id },
          ],
          status: FRIEND_ACCEPTED,
        },
        order: [['updatedAt', 'ASC']],
      });
      // console.log(friends);

      const friendIds = friends.map((el) =>
        el.requestToId === req.user.id ? el.requestFromId : el.requestToId,
      );

      let  usersNotSort

      // if (letter) {
      //    usersNotSort = await User.findAll({
      //     where: { id: friendIds },
      //     attributes: { exclude: ['password'] },
      //     include: {
      //       model: UserDetail,
      //       where: {
      //         [Op.or]: [
      //           { firstName: { [Op.like]: letter } },
      //           { lastName: { [Op.like]: letter } },
      //         ],
      //       },
      //       limit: 10,
      //     },
      //   });
      // } else {
         usersNotSort = await User.findAll({
          where: { id: friendIds },
          attributes: { exclude: ['password'] },
          include: {
            model: UserDetail,
          },
        });
      // }

      let usersNoSearch = [];

      for (let i = 0; i < friendIds.length; i++) {
        console.log(friendIds[i]);
        const tmp = usersNotSort.filter((el) => el.id === friendIds[i]);
        usersNoSearch.push(...tmp);
      }

      let users;

      if (letter) {
        users = usersNoSearch.filter((el) =>
        el.UserDetails[0].firstName
          .toUpperCase()
          .includes(letter.toUpperCase()) ||
          el.UserDetails[0].lastName
          .toUpperCase()
          .includes(letter.toUpperCase())
      );
        // users = usersNoSearch.filter((el) => el.UserDetails.length > 0);
      } else {
        users = usersNoSearch;
      }

  

      res.json({ users });
    } else if (sort?.toUpperCase() === 'FIRST NAME') {
      console.log('qwerettyrty================', letter.toUpperCase());
      const friends = await Friend.findAll({
        where: {
          [Op.or]: [
            { requestToId: req.user.id },
            { requestFromId: req.user.id },
          ],
          status: FRIEND_ACCEPTED,
        },
      });
      // console.log(friends);

      const friendIds = friends.map((el) =>
        el.requestToId === req.user.id ? el.requestFromId : el.requestToId,
      );

      const usersNotSort = await User.findAll({
        where: { id: friendIds },
        attributes: { exclude: ['password'] },
        include: {
          model: UserDetail,
        },
      });

      const usersA = usersNotSort.sort((a, b) => {
        const firstNameA = a.UserDetails[0].firstName.toUpperCase();
        const firstNameB = b.UserDetails[0].firstName.toUpperCase();
        if (firstNameA < firstNameB) {
          return -1;
        }
        if (firstNameA > firstNameB) {
          return 1;
        }
        return 0;
      });
      // console.log(usersA)

      const users = usersA.filter((el) =>
        el.UserDetails[0].firstName
          .toUpperCase()
          .includes(letter.toUpperCase()),
      );
      // console.log(users)

      res.json({ users });
    } else if (sort?.toUpperCase() === 'LAST NAME') {
      const friends = await Friend.findAll({
        where: {
          [Op.or]: [
            { requestToId: req.user.id },
            { requestFromId: req.user.id },
          ],
          status: FRIEND_ACCEPTED,
        },
      });
      // console.log(friends);

      const friendIds = friends.map((el) =>
        el.requestToId === req.user.id ? el.requestFromId : el.requestToId,
      );

      const usersNotSort = await User.findAll({
        where: { id: friendIds },
        attributes: { exclude: ['password'] },
        include: {
          model: UserDetail,
        },
      });

      const usersA = usersNotSort.sort((a, b) => {
        const lastNameA = a.UserDetails[0].lastName.toUpperCase();
        const lastNameB = b.UserDetails[0].lastName.toUpperCase();
        if (lastNameA < lastNameB) {
          return -1;
        }
        if (lastNameA > lastNameB) {
          return 1;
        }
        return 0;
      });

      const users = usersA.filter((el) =>
        el.UserDetails[0].lastName.toUpperCase().includes(letter.toUpperCase()),
      );

      res.json({ users });
    } else {
    }
  } catch (err) {
    next(err);
  }
};

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
      where: {
        [Op.or]: [
          { requestFromId, requestToId: req.user.id },
          { requestFromId: req.user.id, requestToId: requestFromId },
        ],
      },
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
