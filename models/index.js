const {Restaurant} = require('./Restaurant')
const {Menu} = require('./Menu')
const {Item} = require('./Item')

Restaurant.hasMany(Menu);
Menu.belongsTo(Restaurant);
Menu.belongsToMany(Item, {through: 'MenuItem'})
Item.belongsToMany(Menu, {through: 'MenuItem'})

module.exports = { Restaurant, Menu, Item }
