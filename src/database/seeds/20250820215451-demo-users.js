'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        email: 'admin@trampo.com',
        password: await bcrypt.hash('12345', 8),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', { email: 'admin@trampo.com' }, {});
  },
};
