const jwt = require("jsonwebtoken");
const { User } = require("../models");
const createError = require("../util/createError");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("You are unanthorzied", 401);
    }
    const [, token] = authorization.split(" ");
    if (!token) {
      createError("You are unauthorized", 401);
    }
    const payloadDetail = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      where: { id: payloadDetail.id },
    });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
