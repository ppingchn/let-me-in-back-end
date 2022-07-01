const express = require('express');
const createError = require('../util/createError');
const ChatMessage = require('../models');
exports.createChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const chatMessage = await ChatMessage.create({
      senderId: req.senderId,
      resiveId,
      message,
    });
    res.status.json({ chatMessage });
  } catch (error) {
    next(error);
  }
};

exports.updateChatMessage = async (req, res, next) => {
  try {
    const { senderId, resiveId, message } = req.body;
    const { chatMessageId } = req.params;
    const chatMessage = await ChatMessage.findOne({
      where: { id: chatMessageId },
    });
    if (!chatMessage) {
      createError('Chat Message not found', 404);
    }
    bodyUpdate = { message };
    await chatMessage.update(bodyUpdate);
    res.json({ chatMessage });
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
