// db.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');

let sequelize;

try {
  // Create a new Sequelize instance with the credentials from the config file
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
  });
} catch (error) {
  console.error('Error connecting to the database:', error);
}

// Define the "User" model and other database-related code remains the same...
module.exports = {
    sequelize
}