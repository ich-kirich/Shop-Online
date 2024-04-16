'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('feedback', [
      {
        text: 'Great product!',
        grade: 5,
        image: 'https://example.com/image1.jpg',
        userId: 1,
        productId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        text: 'Good quality!',
        grade: 4,
        image: 'https://example.com/image2.jpg',
        userId: 2,
        productId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('feedback', null, {});
  }
};
