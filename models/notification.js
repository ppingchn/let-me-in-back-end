module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      as: 'User',
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Notification.belongsTo(models.Follow);
    Notification.belongsTo(models.Post);
    Notification.belongsTo(models.Comment);

    Notification.belongsTo(models.JobList);
  };
  return Notification;
};
