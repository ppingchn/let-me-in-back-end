module.exports = (sequelize, DataTypes) => {
  const JobAlert = sequelize.define('JobAlert', {});
  JobAlert.associate = (models) => {
    JobAlert.belongsTo(models.User, {
      as: 'CompanyJobAlert',
      foreignKey: {
        name: 'companyId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    JobAlert.belongsTo(models.User, {
      as: 'UserJobAlert',
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return JobAlert;
};
