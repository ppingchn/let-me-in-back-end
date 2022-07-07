module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  Reply.associate = (models) => {
    Reply.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Reply.belongsTo(models.Comment, {
      foreignKey: {
        name: 'commentId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Reply;
};
