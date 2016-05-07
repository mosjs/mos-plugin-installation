'use strict'
module.exports = plugin

const renderInstallation = require('./lib/render-installation')

function plugin (markdown) {
  return {
    installation: opts => renderInstallation(Object.assign(opts, {
      pkg: markdown.pkg,
    })),
  }
}
