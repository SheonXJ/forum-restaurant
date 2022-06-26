const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurants => {
        const data = restaurants.map(res => ({
          ...res,
          description: res.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data
        })
      })
  }
}

module.exports = restaurantController
