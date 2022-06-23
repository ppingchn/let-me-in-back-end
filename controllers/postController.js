const createError = require("../utils/createError");

exports.createPost = async (req, res, next) => {
  try {
    const { detial } = req.body;
    if (!detial && !req.file) {
      createError("detial or image is required", 400);
    }

    const post = await Post.create({ detial, userId: req.user.id });
    res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { detial } = req.body;
    if (!detial && !req.file) {
      createError("detial or image is required", 400);
    }

    const post = await Post.findOne({ where: { id } });
    if (!post) {
      createError("post not found", 400);
    }
    if (post.userId !== req.user.id) {
      createError("you have no permission", 403);
    }

    if (detial) {
      post.detial = detial;
    }
    await post.save();

    res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
exports.deletePost = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      createError("post not found", 400);
    }
    if (post.userId !== req.user.id) {
      createError("you have no permission", 403);
    }
    await Comment.destroy({ where: { postId: id } }, { transaction: t });
    await Like.destroy({ where: { postId: id } }, { transaction: t });

    await Post.destroy({ where: { id } }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
