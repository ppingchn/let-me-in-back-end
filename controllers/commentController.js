const { Comment } = require('../models');
const createError = require('../utils/createError');

exports.createComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { postId } = req.params;
    const comment = await Comment.create({
      title,
      postId,
      userId: req.user.id,
    });
    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { commentId, postId } = req.params;
    const comment = await Comment.findOne({ where: { id: commentId }, postId });
    if (!comment) {
      createError('Commment not found', 404);
    }
    bodyUpdate = { title };
    await comment.save(bodyUpdate);
    res.json({ comment });
  } catch (error) {
    next(error);
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId, postId } = req.params;
    const comment = await Comment.findOne({ where: { id: commentId }, postId });
    if (!comment) {
      createError('Comment not found', 404);
    }
    if (comment.userId !== req.user.id) {
      createError('you have no permission', 403);
    }
    await comment.destroy();
    res.status(204).json({ comment });
  } catch (error) {
    next(error);
  }
};
