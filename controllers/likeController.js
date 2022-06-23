const createError = require("../utils/createError");
exports.createLike = async (req, res, next) => {
  try {
    const { userId, postId } = req.body;
    const like = await Like.create({ userId, postId });
    res.status(201).json({ like });
  } catch (error) {
    next(error);
  }
};

exports.updateLike = async (req, res, next) => {
  try {
    const { userId, postId } = req.body;
    const { likeId } = req.params;
    const like = await Like.finOne({ where: likeId });
    if (!like) {
      createError("Like not found", 404);
    }
    bodyUpdate = { userId, postId };
    await like.update(bodyUpdate);
    res.json({ like });
  } catch (error) {
    next(error);
  }
};
exports.deleteLike = async (req, res, next) => {
  try {
    const { likeId } = req.params;
    const like = await Like.findOne({ where: { id: likeId } });
    if (!like) {
      createError("like not success", 400);
    }
    await like.destroy();
    res.status(204).json({ like });
  } catch (error) {
    next(error);
  }
};
