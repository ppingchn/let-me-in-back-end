const express = require('express');
const createError = require('../util/createError');
const { ChatMessage, User } = require('../models');
const { Socket } = require('../util/socket');

exports.listChatMessageController = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;

    const listMessages = await ChatMessage.findAll({
      where: { chatRoomId },
      include: [
        {
          as: 'Sender',
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });
    res.status(200).json(listMessages);
  } catch (error) {
    next(error);
  }
};

exports.createChatMessage = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    console.log(req.user.id);
    const { message } = req.body;
    const chatMessage = await ChatMessage.create({
      senderId: req.user.id,
      chatRoomId,
      message,
    });
    Socket.emit('chat', {});
    res.status(201).json({ chatMessage });
  } catch (error) {
    next(error);
  }
};

exports.deleteChatMessage = async (req, res, next) => {
  try {
    const { chatMessageId } = req.params;
    const chatMessage = await ChatMessage.findOne({
      where: { id: chatMessageId },
    });
    if (!chatMessage) {
      createError('chat not found', 404);
    }
    await chatMessage.destroy();
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
