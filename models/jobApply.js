module.exports = (sequelize, DataTypes) => {
  const JobApply = sequelize.define('JobApply', {});
  JobApply.associate = (models) => {
    JobApply.belongsTo(models.JobList, {
      foreignKey: {
        name: 'jobListId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    JobApply.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return JobApply;
};
