module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      houseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      subDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      postCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      profilePic: DataTypes.STRING,
      coverPic: DataTypes.STRING,
      role: DataTypes.ENUM(['user', 'company']),
      email: { type: DataTypes.STRING, unique: true },
      phoneNumber: DataTypes.STRING,
      detail: DataTypes.STRING,
    },
    {
      underscore: true,
    },
  );
  User.associate = (models) => {
    User.hasMany(models.Education, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Experience, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Skill, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.UserDetail, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.CompanyDetail, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.JobList, {
      foreignKey: {
        name: 'companyId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.JobApply, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Follow, {
      as: 'Company',
      foreignKey: {
        name: 'companyId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Follow, {
      as: 'User',
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
 
    User.hasMany(models.Friend, {
      as: 'RequestFrom',
      foreignKey: {
        name: 'requestFromId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.ChatRoom, {
      as: 'FirstUser',
      foreignKey: {
        name: 'firstUserId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.ChatRoom, {
      as: 'SecondUser',
      foreignKey: {
        name: 'secondUserId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

   
    User.hasMany(models.JobAlert, {
      as: 'CompanyJobAlert',
      foreignKey: {
        name: 'companyId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.JobAlert, {
      as: 'UserJobAlert',
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    User.hasMany(models.LikeComment, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Comment, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Reply, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Post, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.LikePost, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return User;
};
