const helpers = require('../helpers/auth-helpers')

const authenticator = (req, res, next) => {
  if (helpers.getUser(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatorAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    return res.redirect('/')
  }
  res.redirect('/signin')
}

module.exports = {
  authenticator,
  authenticatorAdmin
}
