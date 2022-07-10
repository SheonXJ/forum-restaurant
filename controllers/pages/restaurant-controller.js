const { Restaurant, Category, User, Comment } = require('../../models')
const helper = require('../../helpers/auth-helpers')
const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
        // { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        // const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isFavorited = req.user.FavoritedRestaurants.some(userRes => restaurant.id === userRes.id)
        const isLike = req.user.LikeRestaurants.some(userRes => restaurant.id === userRes.id)
        restaurant.increment('viewCounts')
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLike
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
        limit: 10,
        order: [['createdAt', 'DESC']]
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ['id', 'name'] },
          { model: Restaurant, attributes: ['id', 'name'] }
        ],
        limit: 10,
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: { model: User, as: 'FavoritedUsers' }
    })
      .then(restaurants => {
        let data = restaurants.sort((a, b) => b.dataValues.FavoritedUsers.length - a.dataValues.FavoritedUsers.length).slice(0, 10)
        data = data.map(res => ({
          ...res.dataValues,
          description: res.dataValues.description.substring(0, 50),
          favoritedCount: res.dataValues.FavoritedUsers.length,
          isFavorited: helper.getUser(req).FavoritedRestaurants.some(userRes => userRes.id === res.dataValues.id)
        }))
        res.render('top-restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
