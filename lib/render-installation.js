'use strict'
const m = require('markdownscript')
const h2 = m.h2
const code = m.code

module.exports = md => [
  h2(['Installation']),
  code({
    lang: 'sh',
    value: createCommand(md),
  }),
]

function createCommand (md) {
  if (md.pkg.private || md.pkg.license === 'private') {
    return [
      `git clone ${md.repo.clone_url} && cd ./${md.repo.repo}`,
      'npm install',
    ].join('\n')
  }
  const installedPkgs = Object.keys(md.pkg.peerDependencies || {}).concat(md.pkg.name).join(' ')
  if (md.pkg.preferDev) {
    return `npm install ${installedPkgs} --save-dev`
  }
  return `npm install ${installedPkgs} ${md.pkg.preferGlobal ? '--global' : '--save'}`
}
