const createError = require('../util/createError');
const { Reply, sequelize } = require('../models');
exports.createReply = async (req, res, next) => {
  try {
    const { title, commentId } = req.body;

    const repliesComment = await Reply.create({
      title,
      commentId,
      userId: req.user.id,
    });
    res.status(201).json({ repliesComment });
  } catch (error) {
    next(error);
  }
};

exports.updateReply = async (req, res, next) => {
  try {
    const { title, commentId } = req.body;
    const { replyId } = req.params;
    const repliesComment = await Reply.findOne({
      where: { id: replyId },
      commentId,
    });

    if (!repliesComment) {
      createError('replies not found', 404);
    }
    if (repliesComment.userId !== req.user.id) {
      createError('you have no permission', 403);
    }
    repliesComment.title = title;
    await repliesComment.save();
    res.json({ repliesComment });
  } catch (error) {
    next(error);
  }
};
exports.deleteReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const repliesComment = await Reply.findOne({ where: { id: replyId } });
    if (!repliesComment) {
      createError('replies not found', 404);
    }
    if (repliesComment.userId !== req.user.id) {
      createError('you have no permission', 403);
    }
    await repliesComment.destroy();
    res.status(204).json({ repliesComment });
  } catch (error) {
    next(error);
  }
};
