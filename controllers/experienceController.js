const createError = require('../util/createError');

const { Experience, User, CompanyDetail } = require('../models');

exports.getExperience = async (req, res, next) => {
  try {
    const { experienceId } = req.params;
    const experience = await Experience.findAll({
      where: { userId: experienceId },
    });

    const result = JSON.parse(JSON.stringify(experience));

    for (let i = 0; i < result.length; i++) {
      const company = await CompanyDetail.findOne({
        where: { companyName: result[i].companyName },
        include: {
          model: User,
          attributes: {
            exclude: ['password', 'username'],
          },
        },
      });
      result[i].company = company;
    }

    res.json({ result });
  } catch (error) {
    next(error);
  }
};

exports.createExperience = async (req, res, next) => {
  try {
    const {
      companyName,
      position,
      yearStart,
      yearEnd,
      userId,
      workDescription,
    } = req.body;
    const experience = await Experience.create({
      companyName,
      position,
      yearStart,
      yearEnd,
      userId,
      workDescription,
    });
    res.json({ experience });
  } catch (error) {
    next(error);
  }
};

exports.updateExperience = async (req, res, next) => {
  try {
    const { companyName, position, yearStart, yearEnd, userId } = req.body;
    const { experienceId } = req.params;
    console.log(experienceId);
    const experience = await Experience.findOne({
      where: { id: experienceId },
    });
    if (!experience) {
      createError('Experience not found');
    }
    bodyUpdate = { companyName, position, yearStart, yearEnd };
    await experience.update(bodyUpdate);
    res.json({ experience });
  } catch (error) {
    next(error);
  }
};
exports.deleteExperience = async (req, res, next) => {
  try {
    const { experienceId } = req.params;
    const experience = await Experience.findOne({ whre: { id: experienceId } });
    if (!experience) {
      createError('Experience not found', 404);
    }
    await experience.destroy();
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
