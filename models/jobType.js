module.exports = (sequelize, DataTypes) => {
  const JobType = sequelize.define(
    'JobType',
    {
      jobTypeName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscore: true,
    }
  );
  JobType.associate = (models) => {
    JobType.hasMany(models.JobList, {
      foreignKey: {
        name: 'jobTypeId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return JobType;
};
