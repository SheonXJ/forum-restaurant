'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Restaurants', 'image', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Restaurants', 'image')
  }
}
