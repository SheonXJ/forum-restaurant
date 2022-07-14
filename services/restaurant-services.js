const helper = require('../helpers/auth-helpers')
const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantServices = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurantsId = req.user?.LikeRestaurants ? req.user.LikeRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        return cb(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => cb(err))
  },
  getRestaurant: (req, cb) => {
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
        return cb(null, {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLike
        })
      })
      .catch(err => cb(err))
  },
  getDashboard: (req, cb) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment,
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        return cb(null, { restaurant: restaurant.toJSON() })
      })
      .catch(err => cb(err))
  },
  getFeeds: (req, cb) => {
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
        return cb(null, { restaurants, comments })
      })
      .catch(err => cb(err))
  },
  getTopRestaurants: (req, cb) => {
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
        return cb(null, { restaurants: data })
      })
      .catch(err => cb(err))
  }
}

module.exports = restaurantServices
