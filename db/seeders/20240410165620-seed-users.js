'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: "$2a$05$P5mICi7VQPnAUaChjQodhOoa0IS19B3G2h5YUaW5NqEXAiWEkedGS", // 12345
        role: 'USER',
        image: 'example.jpg',
        adresses: '123 Street, City, Country',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: "$2a$05$P5mICi7VQPnAUaChjQodhOoa0IS19B3G2h5YUaW5NqEXAiWEkedGS", // 12345
        role: 'ADMIN',
        image: 'example.jpg',
        adresses: '456 Avenue, City, Country',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
