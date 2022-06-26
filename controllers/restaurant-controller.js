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
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        return res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
