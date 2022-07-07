module.exports = (sequelize, DataTypes) => {
  const CompanyDetail = sequelize.define(
    'CompanyDetail',
    {
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      websiteLink: DataTypes.STRING,
      overview: DataTypes.TEXT(),
      address: DataTypes.STRING,
      location: DataTypes.STRING,
    },
    {
      underscore: true,
    },
  );
  CompanyDetail.associate = (models) => {
    CompanyDetail.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return CompanyDetail;
};
