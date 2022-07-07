const createError = require("../utils/createError");
exports.createSkill = async (req, res, next) => {
  try {
    const { title } = req.body;
    const skill = await Skill.create({ title });
    res.status(201).json({ skill });
  } catch (error) {
    next(error);
  }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const skill = await Skill.findOne({ where: { id: skillId } });
    if (!skill) {
      createError("Skill not found");
    }
    await skill.destroy();
    res.status(204).json({ skill });
  } catch (error) {
    next(error);
  }
};
