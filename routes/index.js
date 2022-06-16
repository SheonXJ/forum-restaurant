const express = require('express')
const router = express.Router()

// load modules
const admin = require('./modules/admin')

// load controller
const restController = require('../controllers/restaurant-controller')

// setting router
router.use('/admin', admin)
// setting router[restaurant]
router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
