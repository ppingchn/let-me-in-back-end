const createError = require('../util/createError');
const { JobAlert, JobApply } = require('../models');

exports.createJobAlert = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { id } = req.user;

    const findAlert = await JobAlert.findOne({
      where: { companyId, userId: id },
    });

    if (findAlert) {
      await JobAlert.destroy({ where: { companyId, userId: id } });
      res.status(204).json({ message: 'Delete job alert.' });
    } else {
      const jobAlert = await JobAlert.create({ companyId, userId: id });
      res.status(201).json({ jobAlert });
    }
  } catch (error) {
    next(error);
  }
};

exports.createJobApply = async (req, res, next) => {
  try {
    const { jobListId, userId } = req.body;
    const jobApply = await JobApply.create({ jobListId, userId });
    res.status(201).json({ jobApply });
  } catch (error) {
    next(error);
  }
};

exports.updateJobApply = async (req, res, next) => {
  try {
    const { jobListId, userId } = req.body;
    const { jobApplyId } = req.params;
    const jobApply = await JobApply.findOne({ where: { id: jobApplyId } });
    if (!jobApply) {
      createError('Job apply not found', 404);
    }
    bodyUpdate = { jobListId, userId };
    await JobApply.update(bodyUpdate);
    res.json({ bodyUpdate });
  } catch (error) {
    next(error);
  }
};
exports.deleteJobApply = async (req, res, next) => {
  try {
    const { jobApplyId } = req.params;
    const jobApply = await JobApply.findOne({ where: { id: jobApplyId } });
    if (!jobApply) {
      createError('JOb apply not found', 404);
    }
    await jobApply.destroy();
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
