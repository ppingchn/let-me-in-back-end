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
  return Reply;
};
