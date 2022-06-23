const createError = require("../utils/createError");
exports.createComment = async (req, res, next) => {
  try {
    const { userId, postId, commentId, title } = req.body;
    const comment = await Comment.create({
      userId,
      postId,
      commentId,
      title,
    });
    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { userId, postId, title } = req.body;
    const { commentId } = req.params;
    const comment = await Comment.findOne({ where: { id: commentId } });
    if (!comment) {
      createError("Commment not found", 404);
    }
    bodyUpdate = { title };
    await comment.update(bodyUpdate);
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
      createError("Comment not found", 404);
    }
    await comment.destroy();
    res.status(204).json({ comment });
  } catch (error) {
    next(error);
  }
};
