const createErroror = require("../utils/createerroror");
exports.createEmployees = async (req, res, next) => {
  try {
    const { companyId, userId } = req.body;
    const employees = await Employees.create({ companyId, userId });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployees = async (req, res, next) => {
  try {
    const { employeesId } = req.params;
    const employees = await Employees.finOne({ where: { id: employeesId } });
    if (!employees) {
      createErroror("Employee not found", 404);
    }
    await employees.destroy();
    resizeBy.status(204).json();
  } catch (error) {
    next(error);
  }
};
