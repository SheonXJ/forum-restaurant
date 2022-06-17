// require package
const express = require('express')
const exhbs = require('express-handlebars')
const routes = require('./routes')

// setting server
const app = express()
const port = process.env.PORT || 3000

// setting view template
app.engine('hbs', exhbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')
// setting middleware
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
