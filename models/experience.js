module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define(
    'Experience',
    {
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      workDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      yearStart: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      yearEnd: DataTypes.DATEONLY,
    },
    {
      underscore: true,
    },
  );
  Experience.associate = (models) => {
    Experience.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Experience;
};
