const {sequelize} = require('./db')
const {Restaurant, Menu} = require('./models/index')
const {
    seedRestaurant,
    seedMenu,
  } = require('./seedData');

describe('Restaurant and Menu Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });
    });

    test('can create a Restaurant', async () => {
        const restaurant = await Restaurant.create(seedRestaurant[0]);
        expect(restaurant.name).toEqual('AppleBees');
        expect(restaurant.location).toEqual('Texas');
        expect(restaurant.cuisine).toEqual('FastFood');
    });

    test('can create a Menu', async () => {
        const menuData = seedMenu[0];
        const menu = await Menu.create(menuData);
      
        expect(menu.title).toEqual(menuData.title);
    });

    test('can find Restaurants', async () => {
        await Restaurant.bulkCreate(seedRestaurant);
        const restaurants = await Restaurant.findAll();
        expect(restaurants.length).toEqual(3);
        expect(restaurants[0].name).toEqual('AppleBees');
        expect(restaurants[1].name).toEqual('LittleSheep');
        expect(restaurants[2].name).toEqual('Spice Grill');
    });

    test('can find Menus', async () => {
        const menus = await Menu.findAll();

        expect(menus.length).toEqual(seedMenu.length);
        expect(menus[0].title).toEqual(seedMenu[0].title);
        expect(menus[1].title).toEqual(seedMenu[1].title);
        expect(menus[2].title).toEqual(seedMenu[2].title);
    });

    test('can delete Restaurants', async () => {
        const restaurantData = seedRestaurant[0];
        const restaurant = await Restaurant.create(restaurantData);
      
        const foundRestaurant = await Restaurant.findByPk(restaurant.id);
        expect(foundRestaurant.name).toEqual(restaurantData.name);
      
        await restaurant.destroy();
        const deletedRestaurant = await Restaurant.findByPk(restaurant.id);
        expect(deletedRestaurant).toEqual(null);
    });
})