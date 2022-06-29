const createError = require('../util/createError');
const { LikePost, Post, sequelize } = require('../models');

exports.createLike = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { postId } = req.body;
    const likePost = await LikePost.findOne({
      where: { postId, userId: req.user.id },
    });
    if (likePost) {
      createError('you already liked this post', 400);
    }
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError('post not found', 404);
    }
    const likes = await LikePost.create(
      { postId, userId: req.user.id },
      { transaction: t },
    );
    await post.increment({ likes: 1 }, { transaction: t });
    await t.commit();
    res.status(201).json({ likes });
  } catch (error) {
    next(error);
  }
};

exports.deleteLike = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { postId } = req.params;
    const likePost = await LikePost.findOne({
      where: { postId, userId: req.user.id },
    });
    if (!likePost) {
      createError('can not find like', 404);
    }
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError('post not found', 404);
    }
    await likePost.destroy({ transection: t });
    await post.decrement({ likes: 1 }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
