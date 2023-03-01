const {sequelize} = require('./db')
const {Restaurant, Menu, Item} = require('./models/index')
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

    test('can have multiple menus', async () => {
        const restaurant = await Restaurant.create({
          name: 'My Restaurant'
        })
    
        const menu1 = await Menu.create({
          name: 'Starters',
          RestaurantId: restaurant.id
        })
    
        const menu2 = await Menu.create({
          name: 'Main',
          RestaurantId: restaurant.id
        })
    
        const menus = await restaurant.getMenus()
        expect(menus).toHaveLength(2)
        expect(menus[0].name).toBe('Appetizers')
        expect(menus[1].name).toBe('Entrees')
    
        const restaurantFromMenu = await menu1.getRestaurant()
        expect(restaurantFromMenu.id).toBe(restaurant.id)
        expect(restaurantFromMenu.name).toBe('My Restaurant')
    })

    test('can have multiple items', async () => {
        const menu = await Menu.create({
          name: 'My Menu'
        })
    
        const item1 = await Item.create({
          name: 'Burger',
          image: 'burger.jpg',
          price: 10,
          vegetarian: false
        })
    
        const item2 = await Item.create({
          name: 'Fries',
          image: 'fries.jpg',
          price: 5,
          vegetarian: true
        })
    
        await menu.addItems([item1, item2])
    
        const items = await menu.getItems()
        expect(items).toHaveLength(2)
        expect(items[0].name).toBe('Burger')
        expect(items[1].name).toBe('Fries')
    
        const menusFromItem1 = await item1.getMenus()
        expect(menusFromItem1).toHaveLength(1)
        expect(menusFromItem1[0].name).toBe('My Menu')
    
        const menusFromItem2 = await item2.getMenus()
        expect(menusFromItem2).toHaveLength(1)
        expect(menusFromItem2[0].name).toBe('My Menu')
    })

    test('can eager load items', async () => {
        const menu1 = await Menu.create({
          name: 'Menu 1'
        })
    
        const item1 = await Item.create({
          name: 'Burger',
          image: 'burger.jpg',
          price: 10,
          vegetarian: false
        })
    
        const item2 = await Item.create({
          name: 'Fries',
          image: 'fries.jpg',
          price: 5,
          vegetarian: true
        })
    
        await menu1.addItems([item1, item2])
    
        const menu2 = await Menu.create({
          name: 'Menu 2'
        })
    
        const item3 = await Item.create({
          name: 'Salad',
          image: 'salad.jpg',
          price: 2,
          vegetarian: true
        })
    
        await menu2.addItems([item3])
    
        const menus = await Menu.findAll({
          include: [Item]
        })
    
        expect(menus).toHaveLength(2)
        expect(menus[0].name).toBe('Menu 1')
        expect(menus[0].Items).toHaveLength(2)
        expect(menus[0].Items[0].name).toBe('Burger')
        expect(menus[0].Items[1].name).toBe('Fries')
        expect(menus[1].name).toBe('Menu 2')
        expect(menus[1].Items).toHaveLength(1)
        expect(menus[1].Items[0].name).toBe('Salad')
    })
})