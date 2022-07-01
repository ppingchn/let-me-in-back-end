module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {});
  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      as: 'Company',
      foreignKey: {
        name: 'companyId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Follow.belongsTo(models.User, {
      as: 'FollowerUser',
      foreignKey: {
        name: 'followerId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Follow.belongsTo(models.User, {
      as: 'User',
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
