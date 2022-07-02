const createError = require('../util/createError');
const { Education } = require('../models');

exports.getEducationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const educations = await Education.findAll({
      where: { userId: id },
    });
    res.json({ educations });
  } catch (error) {
    next(error);
  }
};

exports.createEducation = async (req, res, next) => {
  try {
    const { degree, university, field, yearStart, yearEnd } = req.body;
    const { id } = req.user;
    const education = await Education.create({
      userId: id,
      degree,
      university,
      field,
      yearStart,
      yearEnd,
    });
    res.json({ education });
  } catch (error) {
    next(error);
  }
};

exports.updateEducation = async (req, res, next) => {
  try {
    const { degree, university, feild, yearStart, yearEnd } = req.body;
    const { educationId } = req.params;
    const education = await Education.findOne({ where: { id: educationId } });
    if (!education) {
      createError('Education not found', 404);
    }
    bodyUpdate = { degree, university, feild, yearStart, yearEnd };
    await education.update(bodyUpdate);
    res.json({ education });
  } catch (error) {
    next(error);
  }
};

exports.deleleEducation = async (req, res, next) => {
  try {
    const { educationId } = req.params;
    const education = await Education.findOne({ where: { id: educationId } });
    if (!education) {
      createError('Education not found', 404);
    }
    await education.destroy();
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
