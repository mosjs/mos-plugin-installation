'use strict'
const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const m = require('markdownscript')
const heading = m.heading
const text = m.text
const code = m.code

const renderInstallation = require('./render-installation')

describe('createInstallation', () => {
  it('should create installation section for global package', () => {
    const pkg = {
      name: 'foo',
      preferGlobal: true,
    }
    const installation = renderInstallation({pkg})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'npm install --global foo',
      }),
    ])
  })

  it('should create installation section for dev package', () => {
    const pkg = {
      name: 'foo',
      preferDev: true,
    }
    const installation = renderInstallation({pkg})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'npm install --save-dev foo',
      }),
    ])
  })

  it('should create installation section for local package', () => {
    const pkg = {
      name: 'foo',
    }
    const installation = renderInstallation({pkg})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'npm install --save foo',
      }),
    ])
  })

  it('should create installation section for private package', () => {
    const pkg = {
      name: 'foo',
      private: true,
    }
    const repo = {
      repo: 'foo',
      clone_url: 'https://github.com/zkochan/foo',
    }
    const installation = renderInstallation({pkg, repo})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'git clone https://github.com/zkochan/foo && cd ./foo\nnpm install',
      }),
    ])
  })

  it('should create installation section for package with private license', () => {
    const pkg = {
      name: 'foo',
      license: 'private',
    }
    const repo = {
      repo: 'foo',
      clone_url: 'https://github.com/zkochan/foo',
    }
    const installation = renderInstallation({pkg, repo})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'git clone https://github.com/zkochan/foo && cd ./foo\nnpm install',
      }),
    ])
  })

  it('should include peerDependencies in the installation command', () => {
    const pkg = {
      name: 'foo',
      peerDependencies: {
        bar: '1.0.0',
        qar: '2.0.0',
      },
    }
    const installation = renderInstallation({pkg})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'npm install --save bar qar foo',
      }),
    ])
  })

  it('should create short installation section for global package', () => {
    const pkg = {
      name: 'foo',
      preferGlobal: true,
    }
    const installation = renderInstallation({pkg, useShortAlias: true})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'npm i -g foo',
      }),
    ])
  })

  it('should create short installation section for dev package', () => {
    const pkg = {
      name: 'foo',
      preferDev: true,
    }
    const installation = renderInstallation({pkg, useShortAlias: true})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'npm i -D foo',
      }),
    ])
  })

  it('should create short installation section for local package', () => {
    const pkg = {
      name: 'foo',
    }
    const installation = renderInstallation({pkg, useShortAlias: true})
    expect(installation).to.eql([
      heading({ depth: 2 }, [
        text({
          value: 'Installation',
        }),
      ]),
      code({
        lang: 'sh',
        value: 'npm i -S foo',
      }),
    ])
  })
})
