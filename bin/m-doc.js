#!/usr/bin/env node

const { Command } = require('commander')
const chalk = require('chalk')
const { startServer } = require('../lib')
const { version } = require('../package.json')
const program = new Command()

program
  .option('-p, --port <type>', 'default post: 12149')
  .option('-host, --host <type>', 'select host address to bind, default: 0.0.0.0 or local ip address')
  .option('-d, --dist <type>', 'doc folder, default: docs')
  .option('-no-browser, --no-browser', 'prohibit automatic web browser launching')
  .version(`M-Doc ${chalk.green(version)}`, '-v, --version', 'display version')
  .parse(process.argv)

const options = program.opts()

startServer(options)
