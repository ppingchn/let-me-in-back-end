const createError = require("../util/createError");

const { Post, Like, sequelize } = require("../models");

exports.createPost = async (req, res, next) => {
  try {
    const { detail } = req.body;
    if (!detail) {
      createError("detail is required", 400);
    }
    if (!req.user) {
      createError("you have no permission", 403);
    }
    const post = await Post.create({ detail, userId: req.user.id });
    res.json({ post });
  } catch (err) {
    next(err);
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { detail } = req.body;
    if (!detail) {
      createError("detail is required", 400);
    }

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError("post not found", 404);
    }
    if (post.userId !== req.user.id) {
      createError("you have no permission", 403);
    }

    if (detail) {
      post.detail = detail;
    }
    await post.save();

    res.json({ post });
  } catch (err) {
    next(err);
  }
};
exports.deletePost = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { postId } = req.params;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError("post not found", 400);
    }
    if (post.userId !== req.user.id) {
      createError("you have no permission", 403);
    }
    // await Comment.destroy({ where: { postId: postId } }, { transaction: t });
    // await Like.destroy({ where: { postId: postId } }, { transaction: t });

    await Post.destroy({ where: { id: postId } }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getUserPost = async (req, res, next) => {
  try {
    const userId = await FriendService.findFriendId(req.user.id); // [friendId1, friendId2, friendId3, ...]
    userId.push(req.user.id); // Add myId to userId => [friendId1, friendId2, friendId3, ..., myId]

    // SELECT * FROM posts WHERE userId IN (myId, friendId1, friendId2, friendId3, ...)
    const posts = await Post.findAll({
      where: { userId: userId }, // WHERE userId IN (1,2,3) => WHERE userId = 1 OR userId = 2 OR userId = 3
      order: [["updatedAt", "DESC"]],
      attributes: {
        exclude: ["userId"],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "password",
              "email",
              "phoneNumber",
              "coverPhoto",
              "createdAt",
            ],
          },
        },
        {
          model: Comment,
          attributes: {
            exclude: ["createdAt", "userId"],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                "password",
                "email",
                "phoneNumber",
                "coverPhoto",
                "createdAt",
              ],
            },
          },
        },
        {
          model: Like,
          attributes: {
            exclude: ["createdAt"],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                "password",
                "email",
                "phoneNumber",
                "coverPhoto",
                "createdAt",
              ],
            },
          },
        },
      ],
    });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};
