module.exports = (sequelize, DataTypes) => {
  const ResetPassword = sequelize.define(
    'ResetPassword',
    {
      word: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscore: true,
    },
  );
  ResetPassword.associate = (models) => {
    ResetPassword.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return ResetPassword;
};
