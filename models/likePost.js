module.exports = (sequelize, DataTypes) => {
  const LikePost = sequelize.define('LikePost', {});
  LikePost.associate = (models) => {
    LikePost.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    LikePost.belongsTo(models.Post, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return LikePost;
};
