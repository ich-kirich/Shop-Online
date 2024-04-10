'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Product 1',
        type: 'Type 1',
        size: 'Size 1',
        price: 10.99,
        quantity: 100,
        image: 'image1.jpg',
        description: 'Description for product 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 2',
        type: 'Type 2',
        size: 'Size 2',
        price: 20.99,
        quantity: 200,
        image: 'image2.jpg',
        description: 'Description for product 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
