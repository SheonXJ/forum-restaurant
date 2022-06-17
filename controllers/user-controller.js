const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (rqe, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, bcrypt.genSaltSync(10))
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => res.redirect('/signin'))
  }
}

module.exports = userController
