const createError = require('../util/createError');

const {
  JobList,
  User,
  CompanyDetail,
  JobType,
  WorkEnviroment,
  Notification,
} = require('../models');

exports.createJoblist = async (req, res, next) => {
  try {
    const { jobTypeId, workEnvironmentId, position, jobDescription, salary } =
      req.body;
    const { id } = req.user;
    console.log(workEnvironmentId);

    const jobList = await JobList.create({
      companyId: id,
      jobTypeId,
      workEnviromentId: workEnvironmentId,
      position,
      jobDescription,
      salary,
    });

    res.status(201).json({ jobList });
  } catch (error) {
    next(error);
  }
};

exports.getAllJoblist = async (req, res, next) => {
  try {
    const jobList = await JobList.findAll({
      include: {
        model: User,
        attributes: { exclude: ['password'] },
        include: { model: CompanyDetail },
      },
    });

    res.json({ jobList });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await JobList.findOne({
      where: { id: jobId },
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
          include: { model: CompanyDetail },
        },
        {
          model: JobType,
          attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        },
        {
          model: WorkEnviroment,
          attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        },
      ],
    });

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

exports.createJoblist = async (req, res, next) => {
  try {
    const { jobTypeId, workEnvironmentId, position, jobDescription, salary } =
      req.body;
    const { id } = req.user;
    console.log(workEnvironmentId);
    let jobListId;
    const jobList = await JobList.create({
      companyId: id,
      jobTypeId,
      workEnviromentId: workEnvironmentId,
      position,
      jobDescription,
      salary,
    });
    jobListId = JobList.id;
    await Notification.create({ JobListId: jobListId, userId: req.user.id });

    res.status(201).json({ jobList });
  } catch (error) {
    next(error);
  }
};

exports.updateJoblist = async (req, res, next) => {
  try {
    const {
      companyId,
      jobTypeId,
      workEnvironmentId,
      position,
      jobDescription,
      DateLine,
      salary,
    } = req.body;
    const { jobListId } = req.params;
    const jobList = await JobList.findOne({ where: { id: jobListId } });
    if (!jobList) {
      createErroror('Job list not found', 404);
    }
    bodyUpdate = {
      companyId,
      jobTypeId,
      workEnvironmentId,
      position,
      jobDescription,
      DateLine,
      salary,
    };
    await jobList.update(bodyUpdate);
    res.json({ jobList });
  } catch (error) {
    next(error);
  }
};
exports.deleteJoblist = async (req, res, next) => {
  try {
    const { jobListId } = req.params;
    const jobList = await JobList.findOne({ where: { id: jobListId } });
    if (!jobList) {
      createErroror('Job list not found', 404);
    }
    await jobList.destroy();
    res.status(204).json({ jobList });
  } catch (error) {
    next(error);
  }
};
