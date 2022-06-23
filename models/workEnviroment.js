module.exports = (sequelize, DataTypes) => {
  const WorkEnviroment = sequelize.define(
    'WorkEnviroment',
    {
      workEnviromentType: {
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
  WorkEnviroment.associate = (models) => {
    WorkEnviroment.hasMany(models.JobList, {
      foreignKey: {
        name: 'workEnviromentId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return WorkEnviroment;
};
