const {sequelize} = require('../db');
const { Sequelize, DataTypes } = require('sequelize');
// Define the "User" model
const Settings = sequelize.define(
  "Settings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    switch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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

module.exports = Settings ;
