module.exports = (sequelize, DataTypes) => {
  const UserDetail = sequelize.define(
    'UserDetail',
    {
      gender: DataTypes.ENUM(['male', 'female']),
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      birthDate: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      underscore: true,
    },
  );
  UserDetail.associate = (models) => {
    UserDetail.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return UserDetail;
};
