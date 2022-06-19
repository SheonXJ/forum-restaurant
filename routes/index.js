const express = require('express')
const router = express.Router()
const passport = require('passport')
const { generalErrorHandler } = require('../middleware/error-handler')

// load modules
const admin = require('./modules/admin')

// load controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// setting router[admin]
router.use('/admin', admin)
// setting router[user]
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
// setting router[restaurant]
router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => {
  res.redirect('/restaurants')
})
router.use('/', generalErrorHandler)

module.exports = router
