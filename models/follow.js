module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {});
  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      as: 'Company',
      foreignKey: {
        name: 'companyId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Follow.belongsTo(models.User, {
      as: 'Employee',
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Follow;
};
