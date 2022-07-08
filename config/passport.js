const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return done(null, user)
        })
      })
  }))

  // 序列化/反序列化(serialize/deserialize)
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikeRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => done(null, user.toJSON()))
      .catch(err => done(err, null))
  })
}
