const createError = require("../utils/createError");
exports.createJobType = async (req, res, next) => {
  try {
    const { jobTypeName } = req.body;
    const jobType = await JobType.create({ jobTypeName });
    res.status(201).json({ jobType });
  } catch (error) {
    next(error);
  }
};

exports.updateJobType = async (req, res, next) => {
  try {
    const { jobTypeName } = req.body;
    const { jobTypeId } = req.params;
    const jobType = await JobType.findOne({ where: { id: jobTypeId } });
    if (!jobType) {
      createError("Job type not found", 404);
    }
    bodyUpdate = {
      jobTypeName,
    };
    await JobType.update(bodyUpdate);
    res.json({ jobType });
  } catch (error) {
    next(error);
  }
};
exports.deleteJobType = async (req, res, next) => {
  try {
    const { jobTypeId } = req.params;
    const jobType = await JobType.findOne({ where: { id: jobTypeId } });
    if (!jobType) {
      createError("Job type not found", 404);
    }
    await jobType.destroy();
    res.status(204).json({ jobType });
  } catch (error) {
    next(error);
  }
};
