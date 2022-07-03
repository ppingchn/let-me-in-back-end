const express = require('express');
const createError = require('../util/createError');
const { ChatRoom, User } = require('../models');
const { Op } = require('sequelize');

exports.listChatRoomController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let rooms = await ChatRoom.findAll({
      where: {
        [Op.or]: [{ firstUserId: userId }, { secondUserId: userId }],
      },
      include: [
        {
          as: 'FirstUser',
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          as: 'SecondUser',
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });
    rooms = JSON.parse(JSON.stringify(rooms));

    rooms = rooms.map((room) => {
      let other;
      if (room.FirstUser.id == req.user.id) {
        other = room.SecondUser;
      } else {
        other = room.FirstUser;
      }
      return { ...room, user: other };
    });
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.createChatRoomController = async (req, res, next) => {
  try {
    const { firstUserId, secondUserId } = req.body;
    const chatRoom = await ChatRoom.create({
      firstUserId,
      secondUserId,
    });
    res.status(200).json(chatRoom);
  } catch (error) {
    next(error);
  }
};

exports.deleteChatRoomController = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const chatRoom = await ChatRoom.findOne({ where: { id: chatRoomId } });
    if (!chatRoom) {
      createError('Chat Room not found', 404);
    }
    await chatRoom.destroy();
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};
