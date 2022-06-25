const dayjs = require('dayjs')

const ifCond = (a, b, options) => {
  return a === b ? options.fn(this) : options.inverse(this)
}

module.exports = {
  currentYear: () => dayjs().year(),
  ifCond
}
