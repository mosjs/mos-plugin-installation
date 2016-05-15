'use strict'
const m = require('markdownscript')
const h2 = m.h2
const code = m.code

const fullCommands = {
  install: 'install',
  save: '--save',
  saveDev: '--save-dev',
  global: '--global',
}

const shortCommands = {
  install: 'i',
  save: '-S',
  saveDev: '-D',
  global: '-g',
}

module.exports = (mos, md) => {
  Object.assign(mos.scope, {
    installation: opts => [
      h2(['Installation']),
      code({
        lang: 'sh',
        value: createCommand(opts),
      }),
    ],
  })

  function createCommand (opts) {
    opts = Object.assign({}, md.options, opts || {})
    const commands = opts.useShortAlias ? shortCommands : fullCommands
    if (md.pkg.private || md.pkg.license === 'private') {
      return [
        `git clone ${md.repo.clone_url} && cd ./${md.repo.repo}`,
        `npm ${commands.install}`,
      ].join('\n')
    }
    const installedPkgs = Object.keys(md.pkg.peerDependencies || {}).concat(md.pkg.name).join(' ')
    if (md.pkg.preferDev) {
      return `npm ${commands.install} ${commands.saveDev} ${installedPkgs}`
    }
    return `npm ${commands.install} ${md.pkg.preferGlobal ? commands.global : commands.save} ${installedPkgs}`
  }
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
