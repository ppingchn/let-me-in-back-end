const createError = require('../util/createError');

const { Experience } = require('../models');

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
exports.deleteExperience = async () => {
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
