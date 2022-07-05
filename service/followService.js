const { Follow } = require('../models');
const { Op } = require('sequelize');

exports.followId = async (id) => {
  const follows = await Follow.findAll({
    [Op.or]: [{ followerId: id }, { companyId: id }],
  });

  const followIds = follows.map((el) => el.userId);

  return followIds;
};
