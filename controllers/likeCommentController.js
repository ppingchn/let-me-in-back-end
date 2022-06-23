const createError = require("../utils/createError");
exports.createLikeComment = async (req, res, next) => {
  try {
    const { userId, commentId } = req.body;
    const likeComment = await LikeComment.create({ userId, commentId });
    res.status(201).json({ likeComment });
  } catch (error) {
    next(error);
  }
};

exports.updateLikeComment = async (req, res, next) => {
  try {
    const { userId, commentId } = req.body;
    const { likeCommentId } = req.params;
    const likeComment = await LikeComment.findOne({
      where: { id: likeCommentId },
    });
    if (!likeComment) {
      createError("Like comment not found", 404);
    }
    bodyUpdate = { userId, commentId };
    await LikeComment.update(bodyUpdate);
    res.json({ likeComment });
  } catch (error) {
    next(error);
  }
};
exports.deleteLikeComment = async (req, res, next) => {
  try {
    const { likeCommentId } = req.params;
    const likeComment = await LikeComment.findOne({
      where: { id: likeCommentId },
    });
    if (!likeComment) {
      createError("Like  comment not fund", 404);
    }
    await likeComment.destroy();
    res.status(204).json({ likeComment });
  } catch (error) {
    next(error);
  }
};
