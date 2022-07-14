const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')
const upload = require('../../../middleware/multer')

// setting router[category]
router.delete('/categories/:id', categoryController.deleteCategory)
router.put('/categories/:id', categoryController.putCategory)
router.get('/categories/:id', categoryController.getCategories)
router.post('/categories', categoryController.postCategories)
router.get('/categories', categoryController.getCategories)
// setting router[restaurants]
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
