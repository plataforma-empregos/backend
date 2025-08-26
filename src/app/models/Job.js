const { Model, DataTypes } = require('sequelize');

class Job extends Model {
  static init(sequelize) {
    super.init({
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      company: DataTypes.STRING,
    }, { sequelize });

    return this;
  }
}

module.exports = Job;
