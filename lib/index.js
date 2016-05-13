'use strict'
module.exports = plugin

const renderInstallation = require('./render-installation')

function plugin (markdown) {
  return {
    installation: opts => renderInstallation(Object.assign(opts || {}, markdown)),
  }
}