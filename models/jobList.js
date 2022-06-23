module.exports = (sequelize, DataTypes) => {
  const JobList = sequelize.define(
    'JobList',
    {
      position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      jobDescription: DataTypes.STRING,
      deadLine: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      salary: DataTypes.STRING,
    },
    {
      underscore: true,
    }
  );
  JobList.associate = (models) => {
    JobList.hasMany(models.JobApply, {
      foreignKey: {
        name: 'jobListId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    JobList.belongsTo(models.User, {
      foreignKey: {
        name: 'companyId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    JobList.belongsTo(models.JobType, {
      foreignKey: {
        name: 'jobTypeId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    JobList.belongsTo(models.WorkEnviroment, {
      foreignKey: {
        name: 'workEnviromentId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return JobList;
};
