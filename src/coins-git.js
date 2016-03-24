#!/usr/bin/env node
'use strict'
require('./handle-errors')()
const chalk = require('chalk')
const columnify = require('columnify')
const git = require('./git.js')
const program = require('commander')
.option('-v, --verbose', 'show full command output, vs single line')
program.on('--help', function () {
  console.log([
    '    Please provide a git command (e.g. pull, push, checkout, etc).',
    '    Example:',
    '\tcoins git checkout release',
    ''
  ].join('\n\n'))
})
program.parse(process.argv)
const action = program.args[0]
const verbose = program.verbose
const args = program.args

if (!action) return git.print()

git.bulkAction({ args, verbose }, (err, rslt) => {
  if (err) {
    program.outputHelp()
    throw err
  }
  rslt = rslt.map((rp) => {
    if (rp.error) {
      rp.error = chalk.red(rp.error)
    }
    return rp
  })
  console.log(columnify(rslt))
})
