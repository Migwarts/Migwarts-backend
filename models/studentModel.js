const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    dormitory: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Student };
