const express = require('express')
const router = express.Router()
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
// setting router[restaurant]
router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => {
  res.redirect('/restaurants')
})
router.use('/', generalErrorHandler)

module.exports = router
