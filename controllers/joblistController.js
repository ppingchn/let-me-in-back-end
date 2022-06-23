const createErroror = require("../utils/createerroror");
exports.createJoblist = async (req, res, next) => {
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
    const jobList = await JobList.create({
      companyId,
      jobTypeId,
      workEnvironmentId,
      position,
      jobDescription,
      DateLine,
      salary,
    });
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
      createErroror("Job list not found", 404);
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
      createErroror("Job list not found", 404);
    }
    await jobList.destroy();
    res.status(204).json({ jobList });
  } catch (error) {
    next(error);
  }
};
