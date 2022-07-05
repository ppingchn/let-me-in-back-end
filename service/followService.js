const { Follow } = require('../models');

exports.followId = async (id) => {
  const follows = await Follow.findAll({
    where: { followerId: id },
  });

  const followIds = follows.map((el) => el.userId);

  return followIds;
};
