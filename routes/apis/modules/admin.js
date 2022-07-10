const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')

router.all('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
