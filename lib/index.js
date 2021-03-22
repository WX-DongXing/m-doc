const http = require('http')
const path = require('path')
const chalk = require('chalk')
const sirv = require('sirv')
const open = require('open')
const Markdown = require('markdown-it')
const WebSocket = require('ws')
const { deployDB } = require('./db')
const { PORT, LOCAL_ADDRESS, DOCS_FOLDER } = require('./constants')
const { getIPAddress } = require('./utils')
const log = console.log

WebSocket.prototype.easySend = function (event, message) {
  if (event !== 'MARKDOWN_RESULT') {
    this.send(`${event}|${JSON.stringify(message)}`)
  } else {
    this.send(`${event}|${message}`)
  }
}

/**
 * start server
 * @param options
 * @returns {Promise<void>}
 */
async function startServer (options) {
  const {
    port = PORT,
    host = LOCAL_ADDRESS,
    dist = DOCS_FOLDER,
    browser = true
  } = options || {}

  const db = await deployDB(dist)

  const markdown = new Markdown({
    linkify: true,
    breaks: true
  })

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
        console.log(message)
        const [source, event, split, data] = message.match(/([A-Z_]+)(\|)([\s\S]+)?/)
        switch (event) {
          case 'CONNECTED':
            log(chalk.bold.green('Connected: '), data)
            break
          case 'RECORD':
            if (client !== ws) {
              log(chalk.blue('Target Emit Record'))
              client.send(message)
              log(chalk.red(message))
            }
            break
          case 'FETCH':
            if (client === ws) {
              log(chalk.green('Client Fetch Source'))
              const source = db.getState()
              client.easySend('UPDATE', source)
            }
            break
          case 'STORAGE':
            if (client === ws) {
              log(chalk.yellow('Client Storage Source'))
              db.setState(JSON.parse(data)).write()
              client.easySend('NOTIFICATION', {
                type: 'success',
                title: '成功',
                message: '已保存！'
              })
            }
            break
          case 'PARSE_MARKDOWN':
            if (client === ws) {
              log(chalk.white('Markdown'))
              const result = markdown.render(data || '')
              client.easySend('MARKDOWN_RESULT', result)
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
