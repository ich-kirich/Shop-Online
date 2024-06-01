'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('order_product', [
      {
        quantity: 2,
        price: 50.99,
        productId: 1,
        orderId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quantity: 3,
        price: 30.50,
        productId: 2,
        orderId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_product', null, {});
  }
};
