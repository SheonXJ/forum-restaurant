const express = require('express')
const router = express.Router()
const { authenticatorAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/admin-controller')

router.get('/', authenticatorAdmin, adminController.getRestaurants)

module.exports = router
