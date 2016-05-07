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

module.exports = opts => [
  h2(['Installation']),
  code({
    lang: 'sh',
    value: createCommand(opts),
  }),
]

function createCommand (opts) {
  const commands = opts.useShortAlias ? shortCommands : fullCommands
  if (opts.pkg.private || opts.pkg.license === 'private') {
    return [
      `git clone ${opts.repo.clone_url} && cd ./${opts.repo.repo}`,
      `npm ${commands.install}`,
    ].join('\n')
  }
  const installedPkgs = Object.keys(opts.pkg.peerDependencies || {}).concat(opts.pkg.name).join(' ')
  if (opts.pkg.preferDev) {
    return `npm ${commands.install} ${installedPkgs} ${commands.saveDev}`
  }
  return `npm ${commands.install} ${installedPkgs} ${opts.pkg.preferGlobal ? commands.global : commands.save}`
}
