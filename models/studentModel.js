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
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dormitory: {
      type: DataTypes.STRING,
    },
    chat: {
      type: DataTypes.TEXT, // JSON 형태로 저장하려면 TEXT 사용
      get() {
        const value = this.getDataValue("chat");
        return value ? JSON.parse(value) : []; // JSON으로 변환
      },
      set(value) {
        this.setDataValue("chat", JSON.stringify(value)); // JSON 변환 후 저장
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Student };
