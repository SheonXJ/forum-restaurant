// require package
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const exhbs = require('express-handlebars')
const routes = require('./routes')
const usePassport = require('./config/passport')

// setting server
const app = express()
const port = process.env.PORT || 3000

// setting view template
app.engine('hbs', exhbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')
// setting middleware
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }))
app.use(flash())
usePassport(app)
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
