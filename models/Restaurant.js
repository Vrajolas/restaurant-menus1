const {sequelize} = require('../db');
const { Sequelize } = require('sequelize');

// TODO - create a Restaurant model
const Restaurant = sequelize.define('restaurant', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },

    location: {
      type: Sequelize.STRING,
      allowNull: false
    },

    cuisine: {
      type: Sequelize.STRING,
      allowNull: false
    }
    
});

module.exports = {Restaurant};