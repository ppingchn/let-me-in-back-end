module.exports = (sequelize, DataTypes) => {
  const LikeComment = sequelize.define('LikeComment', {});
  LikeComment.associate = (models) => {
    LikeComment.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    LikeComment.belongsTo(models.Comment, {
      foreignKey: {
        name: 'commentId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return LikeComment;
};
