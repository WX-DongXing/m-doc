const http = require('http')
const path = require('path')
const chalk = require('chalk')
const sirv = require('sirv')
const open = require('open')
const WebSocket = require('ws')
const { PORT, LOCAL_ADDRESS } = require('./constants')
const { getIPAddress } = require('./utils')
const log = console.log

/**
 * start server
 * @param options
 * @returns {Promise<void>}
 */
async function startServer (options) {
  const {
    port = PORT,
    host = LOCAL_ADDRESS,
    browser = true,
    dist = 'docs'
  } = options || {}

  const ipHost = getIPAddress()

  const sirvMiddleware = sirv(path.resolve(__dirname, '../public'), { single: true })

  const server = http.createServer((req, res) => sirvMiddleware(req, res))

  await new Promise(resolve => {
    server.listen(port, host, () => {
      resolve()

      const url = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/`

      log(`
  ${chalk.green('M-Doc')} running at:
  - Local:   ${url}
  - Network: http://${ipHost}:${port}/

  Use ${chalk.green('Ctrl+C')} to close it
      `)

      if (browser) {
        open(url)
      }
    })
  })

  const socket = new WebSocket.Server({ server })

  socket.on('connection', client => {
    client.on('error', err => {
      log(chalk.red(err.message))
    })

    client.on('message', message => {
      log(chalk.bold.green('Message:'), message)
    })
  })

  return { socket, server }
}

module.exports = {
  startServer
}