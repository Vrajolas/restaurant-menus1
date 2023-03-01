const {sequelize} = require('../db');
const { Sequelize } = require('sequelize');

const Item = sequelize.define('item', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },

    image: {
      type: Sequelize.STRING,
      allowNull: false
    },

    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    vegetarian: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }

});
  
module.exports = {Item};