const createError = require('../util/createError');
const { LikeComment, Comment, sequelize } = require('../models');
exports.createLikeComment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { commentId } = req.body;
    const likeComment = await LikeComment.findOne({
      where: { commentId, userId: req.user.id },
    });
    if (likeComment) {
      createError('you already like this comment', 400);
    }
    const comment = await Comment.findOne({ where: { id: commentId } });
    if (!comment) {
      createError('comment not found', 404);
    }
    const likes = await LikeComment.create(
      { commentId, userId: req.user.id },
      { transection: t },
    );
    await comment.increment({ likes: 1 }, { transaction: t });
    await t.commit();
    res.status(201).json({ likes });
  } catch (error) {
    next(error);
  }
};

exports.deleteLikeComment = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { commentId } = req.params;
    const likeComment = await LikeComment.findOne({
      where: { commentId, userId: req.user.id },
    });
    if (!likeComment) {
      createError('Like  comment not fund', 404);
    }
    const comment = await Comment.findOne({ where: { id: commentId } });
    if (!comment) {
      createError('comment not found', 404);
    }

    await likeComment.destroy({ transaction: t });
    await comment.decrement({ likes: 1 }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
