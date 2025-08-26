'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Jobs', [
      {
        title: 'Desenvolvedor Backend Jr',
        description: 'Trabalhar com Node.js, Express e bancos SQL.',
        company: 'Tech Corp',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Designer UX/UI',
        description: 'Criar interfaces intuitivas e responsivas.',
        company: 'Creative Studio',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Jobs', null, {});
  }
};
