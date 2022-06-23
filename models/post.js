module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Post.associate = (models) => {
    Post.hasMany(models.Comment, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Post.hasMany(models.LikePost, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Post.hasMany(models.PostPicture, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Post.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Post;
};
