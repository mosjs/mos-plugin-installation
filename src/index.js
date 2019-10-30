'use strict'
const toString = require('mdast-util-to-string')
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

export default function plugin (mos, md) {
  mos.compile.pre((next, ast, opts) => {
    ast.children = updateInstallationSection(ast.children)
    return next(ast, opts)
  })

  Object.assign(mos.scope, {
    installation: compileInstallation,
  })

  function compileInstallation (opts) {
    opts = Object.assign({}, md.options, opts || {})
    return [
      h2(['Installation']),
      code({
        lang: 'sh',
        value: createCommand(opts),
      }),
    ]
  }

  function createCommand (opts) {
    const commands = opts.useShortAlias ? shortCommands : fullCommands
    if (md.pkg.private || md.pkg.license === 'private') {
      return [
        `git clone ${md.repo.clone_url} && cd ./${md.repo.repo}`,
        '',
        '# via NPM',
        `npm ${commands.install}`,
        '',
        '# via Yarn',
        'yarn',
      ].join('\n')
    }
    const installedPkgs = Object.keys(md.pkg.peerDependencies || {}).concat(md.pkg.name).join(' ')
    if (md.pkg.preferDev) {
      return [
        '# via NPM',
        `npm ${commands.install} ${commands.saveDev} ${installedPkgs}`,
        '',
        '# via Yarn',
        `yarn add --dev ${installedPkgs}`,
      ].join('\n')
    }
    return [
      '# via NPM',
      `npm ${commands.install} ${md.pkg.preferGlobal ? commands.global : commands.save} ${installedPkgs}`,
      '',
      '# via Yarn',
      `yarn${md.pkg.preferGlobal ? ' global' : ''} add ${installedPkgs}`,
    ].join('\n')
  }

  function updateInstallationSection (children) {
    if (!children.length) {
      return []
    }
    const child = children.shift()
    if (child.type === 'heading' && toString(child).match(/^installation$/i)) {
      return compileInstallation().concat(removeSection(children))
    }
    return [child].concat(updateInstallationSection(children))
  }

  function removeSection (children) {
    if (!children.length) {
      return []
    }
    const child = children.shift()
    if (~['heading', 'markdownScript', 'thematicBreak'].indexOf(child.type)) {
      return [child].concat(children)
    }
    return removeSection(children)
  }
}

plugin.attributes = {
  pkg: require('../package.json'),
}
