const {sequelize} = require('../db');
const { Sequelize, DataTypes } = require('sequelize');
// Define the "User" model
const Logs = sequelize.define(
  "Logs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pvcr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pcr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puts: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Change: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calls: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
    underscored: true, // Use snake_case for the automatically generated fields (createdAt, updatedAt)
  }
);

// Sync the model with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Error creating database:", err);
  });

module.exports = Logs ;
