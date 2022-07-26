const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const ifCond = (a, b, options) => {
  return a === b ? options.fn(this) : options.inverse(this)
}

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  currentYear: () => dayjs().year(),
  ifCond
}
