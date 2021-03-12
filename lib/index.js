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
    browser = true
  } = options || {}

  const ipAddress = getIPAddress()

  const sirvMiddleware = sirv(path.resolve(__dirname, '../public'), { single: true })

  const server = http.createServer((req, res) => sirvMiddleware(req, res))

  await new Promise(resolve => {
    server.listen(port, host, () => {
      resolve()

      const url = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/`

      log(`
  ${chalk.green('[M-Doc]')} running at:
  - Local:   ${url}
  - Network: http://${ipAddress}:${port}/

  Use ${chalk.green('Ctrl+C')} to close it
      `)

      if (browser) {
        open(url)
      }
    })
  })

  const wss = new WebSocket.Server({ server })

  wss.on('connection', ws => {
    ws.on('error', err => {
      log(chalk.red(err.message))
    })

    ws.on('message', message => {
      wss.clients.forEach(client => {
        const [event, record] = message.split('|')
        switch (event) {
          case 'CONNECTED':
            log(chalk.bold.green('Message: '), record)
            break
          case 'RECORD':
            if (client !== ws) {
              log(chalk.bold.blueBright('Record:'), record)
              client.send(message)
            }
            break
          case 'SERVER':
            if (client === ws) {
              log(chalk.bold.green('Server:'), record)
            }
            break
          default:
            break
        }
      })
    })
  })
}

module.exports = {
  startServer
}
