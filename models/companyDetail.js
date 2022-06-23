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
      detail: DataTypes.STRING,
      websiteLink: DataTypes.STRING,
      overview: DataTypes.STRING,
      address: DataTypes.STRING,
      location: DataTypes.STRING,
    },
    {
      underscore: true,
    }
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
