const { Command } = require('commander')
const chalk = require('chalk')
const { startServer } = require('./index')
const { version } = require('../package.json')
const program = new Command()

program
  .option('-p, --post', 'default post: 19364')
  .option('-host, --host', 'select host address to bind, default: 0.0.0.0 or local ip address')
  .option('-d, --dist', 'doc folder, default: docs')
  .option('-no-browser, --no-browser', 'prohibit automatic web browser launching')
  .version(`M-Doc ${chalk.green(version)}`, '-v, --version', 'display version')
  .parse(process.argv)

const options = program.opts()

startServer(options)
