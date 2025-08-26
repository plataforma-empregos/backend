const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'Users',
        hooks: {
          beforeSave: async (user) => {
            if (user.password) {
              user.password = await bcrypt.hash(user.password, 8);
            }
          },
        },
      }
    );
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
