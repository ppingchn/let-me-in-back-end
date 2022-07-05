module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'senderId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    ChatMessage.belongsTo(models.ChatRoom, {
      foreignKey: {
        name: 'chatRoomId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return ChatMessage;
};
