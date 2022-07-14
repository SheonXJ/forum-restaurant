const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../../controllers/apis/user-controller')
const restController = require('../../controllers/apis/restaurant-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const admin = require('../apis/modules/admin')

// setting router[admin]
router.use('/admin', authenticated, authenticatedAdmin, admin)
// setting router[user]
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.get('/users/top', authenticated, userController.getTopUsers)
router.put('/users/:id', authenticated, userController.putUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)
// setting router[restaurant]
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
