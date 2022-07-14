const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')

const userServices = {
  signUp: (req, cb) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exist!')
        return bcrypt.hash(req.body.password, bcrypt.genSaltSync(10))
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        Comment,
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist")
        if (!user.Comments) {
          return cb(null, { user: user.toJSON() })
        }
        return Comment.findAll({
          raw: true,
          nest: true,
          attributes: ['restaurantId'],
          include: Restaurant,
          where: { userId: user.id },
          group: ['restaurantId']
        })
          .then(comments => {
            return cb(null, { comments, user: user.toJSON() })
          })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist")
        if (user.id !== req.user.id) throw new Error("User didn't exist")
        delete user.password
        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Name and Email is required!')
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist")
        if (user.id !== req.user.id) throw new Error("Can't edit this account")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  addFavorite: (req, cb) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ where: { userId, restaurantId } })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({
          userId,
          restaurantId
        })
      })
      .then(favorite => cb(null, favorite))
      .catch(err => cb(err))
  },
  removeFavorite: (req, cb) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Favorite.destroy({
      where: { userId, restaurantId }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant!")
        return cb(null, favorite)
      })
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Promise.all([
      Like.findOne({ where: { userId, restaurantId } }),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([like, restaurant]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')
        return Like.create({
          userId,
          restaurantId
        })
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Like.findOne({ where: { userId, restaurantId } })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant!")
        return like.destroy()
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  },
  getTopUsers: (req, cb) => {
    return User.findAll({
      include: { model: User, as: 'Followers' }
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(userFollowings => userFollowings.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return cb(null, { users: result })
      })
      .catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(followship => cb(null, followship))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    const { userId } = req.params
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(followship => cb(null, followship))
      .catch(err => cb(err))
  }
}

module.exports = userServices
