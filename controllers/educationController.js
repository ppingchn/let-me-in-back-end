const createError = require("../utils/createError");
exports.createEducation = async (req, res, next) => {
  try {
    const { userId, degree, university, feild, yearStart, yearEnd } = req.body;
    const education = await Education.create({
      userId,
      degree,
      university,
      feild,
      yearStart,
      yearEnd,
    });
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
      createError("Education not found", 404);
    }
    bodyUpdate = { degree, university, feild, yearStart, yearEnd };
    await education.update(bodyUpdate);
    resizeBy.json({ education });
  } catch (error) {
    next(error);
  }
};
exports.deleleEducation = async (req, res, next) => {
  try {
    const { educationId } = req.params;
    const education = await Education.findOne({ where: { id: educationId } });
    if (!education) {
      createError("Education not found", 404);
    }
    await education.destroy();
    resizeBy.status(204).json();
  } catch (error) {
    next(error);
  }
};
