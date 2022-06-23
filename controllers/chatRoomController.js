const express = require("express");
const createError = require("../utils/createError");

exports.createChatRoomController = async (req, res, next) => {
  try {
    const { firstId, secondId } = req.body;
    const chatRoom = await ChatRoom.create({
      firstId,
      secondId,
    });
  } catch (error) {
    next(error);
  }
};

// exports.updateChatRoomController = async () => {
//   try {
//     const { firstId, secondId, } = req.body;
//     const {chatRoomId} = req.params
//     const  chatRoom =await ChatRoom.findOne({where:{id:chatRoomId}})
//     if (!chatRoom){
//       createError("Chat room not found",404)
//     }
//     bodyUpdate ={}
//   } catch (error) {
//     next(error);
//   }
// };
exports.deleteChatRoomController = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const chatRoom = await ChatRoom.findOne({ where: { id: chatRoomId } });
    if (!chatRoom) {
      createError("Chat Room not found", 404);
    }
    await chatRoom.destroy();
    res.status(204).json;
  } catch (error) {
    next(error);
  }
};
