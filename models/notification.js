module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      as: 'Company',
      foreignKey: {
        name: 'companyId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Notification.belongsTo(models.User, {
      as: 'User',
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Notification.belongsTo(models.Follow, {
      as: 'Follow',
      foreignKey: {
        name: 'followId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Notification.belongsTo(models.Post, {
      as: 'Post',
      foreignKey: {
        name: 'postId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Notification.belongsTo(models.Comment, {
      as: 'Comment',
      foreignKey: {
        name: 'commentId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Notification.belongsTo(models.JobType, {
      as: 'JobType',
      foreignKey: {
        name: 'jobTypeId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Notification;
};
