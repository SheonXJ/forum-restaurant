// require package
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const path = require('path')
const routes = require('./routes')
const usePassport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

// 判別開發環境
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// setting server
const app = express()
const port = process.env.PORT || 3000

// setting view template
app.engine('hbs', exhbs({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
// setting middleware
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }))
app.use(flash())
usePassport(app)
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
