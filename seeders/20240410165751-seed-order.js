'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orders', [
      {
        number: 1,
        date: new Date(),
        price: 100.50,
        address: 'Address 1',
        status: 'Pending',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        number: 2,
        date: new Date(),
        price: 200.75,
        address: 'Address 2',
        status: 'Completed',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
