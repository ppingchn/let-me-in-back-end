const { Follow } = require('../models');
const { Op } = require('sequelize');

exports.followId = async (id) => {
  const follows = await Follow.findAll({ where: { userId: id } });

  const followIds = follows.map((el) => {
    if (el.followId) {
      return el.followId;
    } else {
      return el.companyId;
    }
  });

  return followIds;
};
