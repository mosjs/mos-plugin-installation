'use strict'
module.exports = (mos, md) => Object.assign(mos.scope, require('./lib')(md))

module.exports.attributes = {
  pkg: require('./package.json'),
}
