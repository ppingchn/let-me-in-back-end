module.exports = (sequelize, DataTypes) => {
  const PostPicture = sequelize.define("PostPicture", {
    postPic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  PostPicture.associate = (models) => {
    PostPicture.belongsTo(models.Post, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    PostPicture.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return PostPicture;
};
