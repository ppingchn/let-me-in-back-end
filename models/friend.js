module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    status: DataTypes.ENUM(['pending', 'accepted']),
  });
  Friend.associate = (models) => {
    Friend.belongsTo(models.User, {
      as: 'RequestTo',
      foreignKey: {
        name: 'requestToId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Friend.belongsTo(models.User, {
      as: 'RequestFrom',
      foreignKey: {
        name: 'requestFromId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Friend;
};
