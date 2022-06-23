module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define('ChatRoom', {});
  ChatRoom.associate = (models) => {
    ChatRoom.belongsTo(models.User, {
      as: 'FirstUser',
      foreignKey: {
        name: 'firstUserId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    ChatRoom.belongsTo(models.User, {
      as: 'SecondUser',
      foreignKey: {
        name: 'secondUserId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return ChatRoom;
};
