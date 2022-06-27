const createError = require('../util/createError');
const { Comment } = require('../models');
exports.createComment = async (req, res, next) => {
  console.log(req.params);
  try {
    const { title, postId } = req.body;

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
    const { title, postId } = req.body;
    const { commentId } = req.params;

    const comment = await Comment.findOne({ where: { id: commentId }, postId });
    if (!comment) {
      createError('Commment not found', 404);
    }

    if (comment.userId !== req.user.id) {
      createError('you have no permission', 403);
    }
    comment.title = title;
    await comment.save();
    res.json({ comment });
  } catch (error) {
    next(error);
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findOne({ where: { id: commentId } });
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
