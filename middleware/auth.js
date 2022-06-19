const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')

const authenticator = (req, res, next) => {
  if (getUser(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatorAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
    return res.redirect('/')
  }
  res.redirect('/signin')
}

module.exports = {
  authenticator,
  authenticatorAdmin
}
