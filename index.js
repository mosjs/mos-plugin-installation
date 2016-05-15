'use strict'
const renderInstallation = require('./lib/render-installation')

module.exports = (mos, md) => {
  Object.assign(mos.scope, {
    installation: opts => renderInstallation(Object.assign(opts || {}, md)),
  })
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
