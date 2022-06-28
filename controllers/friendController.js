const express = require("express");
const createError = require("../utils/createError");
exports.createFriends = async (req, res, next) => {
  try {
    const { requestToId, requestFromId, status } = req.body;
    const friend = await Friend.create({ requestToId, requestFromId, status });
    res.status(201).json({ friend });
  } catch (error) {
    next(error);
  }
};

exports.updateFriends = async (req, res, next) => {
  try {
    const { requestToId, requestFromId, status } = req.body;
    const { friendId } = req.params;
    const friend = await Friend.findOne({ where: { id: friendId } });
    if (!friend) {
      bodyUpdate = { status };
      await Friend.update(bodyUpdate);
      res.json({ friend });
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteFriends = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const friend = await Friend.findOne({ where: { id: friendId } });
    if (!friend) {
      createErroror("Friend not found", 404);
    }
    await friend.destroy();
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
