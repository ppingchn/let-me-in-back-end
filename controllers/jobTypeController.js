const createError = require('../util/createError');

const { JobType, WorkEnviroment } = require('../models');

exports.createJobType = async (req, res, next) => {
  try {
    const { jobTypeName } = req.body;

    const findJobTypeName = await JobType.findOne({
      where: { jobTypeName: jobTypeName.toUpperCase() },
    });

    if (findJobTypeName) {
      req.body.jobTypeId = findJobTypeName.id;
      next();
    } else {
      const jobtype = await JobType.create({
        jobTypeName: jobTypeName.toUpperCase(),
      });
      req.body.jobTypeId = jobtype.id;
      next();
    }
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
      createError('Job type not found', 404);
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
      createError('Job type not found', 404);
    }
    await jobType.destroy();
    res.status(204).json({ jobType });
  } catch (error) {
    next(error);
  }
};
