const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../../controllers/apis/user-controller')
const restController = require('../../controllers/apis/restaurant-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const admin = require('../apis/modules/admin')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
