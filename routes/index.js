const express = require('express')
const router = express.Router()
const passport = require('passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')
const { authenticator, authenticatorAdmin } = require('../middleware/auth')

// load modules
const admin = require('./modules/admin')

// load controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

// setting router[admin]
router.use('/admin', authenticatorAdmin, admin)
// setting router[user]
router.put('/users/:id', authenticator, upload.single('image'), userController.putUser)
router.get('/users/:id/edit', authenticator, userController.editUser)
router.get('/users/:id', authenticator, userController.getUser)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
// setting router[comment]
router.post('/comments', authenticator, commentController.postComment)
router.delete('/comments/:id', authenticator, commentController.deleteComment)
// setting router[restaurant]
router.get('/restaurants/:id/dashboard', authenticator, restController.getDashboard)
router.get('/restaurants/:id', authenticator, restController.getRestaurant)
router.get('/restaurants', authenticator, restController.getRestaurants)

router.use('/', (req, res) => {
  res.redirect('/restaurants')
})
router.use('/', generalErrorHandler)

module.exports = router
