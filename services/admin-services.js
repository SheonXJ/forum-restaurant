const { Restaurant, Category, User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')

const adminServices = {
  getRestaurants: (req, cb) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => cb(null, { restaurants }))
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
    const id = req.params.id
    return Restaurant.findByPk(id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(deleteRestaurant => cb(null, { restaurant: deleteRestaurant }))
      .catch(err => cb(err))
  },
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(newRestaurant => cb(null, { newRestaurant }))
      .catch(err => cb(err))
  },
  createRestaurant: (req, cb) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => cb(null, { categories }))
      .catch(err => cb(err))
  },
  getRestaurant: (req, cb) => {
    const id = req.params.id
    Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return cb(null, restaurant)
      })
      .catch(err => cb(err))
  },
  editRestaurant: (req, cb) => {
    const id = req.params.id
    return Promise.all([
      Restaurant.findByPk(id, {
        raw: true
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return cb(null, { restaurant, categories })
      })
      .catch(err => cb(err))
  },
  putRestaurant: (req, cb) => {
    const id = req.params.id
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    return Promise.all([Restaurant.findByPk(id), imgurFileHandler(file)])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(restaurant => {
        return cb(null, restaurant)
      })
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  patchUser: (req, cb) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (user.email === 'root@example.com') throw new Error('禁止變更 root 權限')
        user.update({ isAdmin: !user.isAdmin })
        return cb(null, user)
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
