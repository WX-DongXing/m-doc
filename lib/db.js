const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { DOCS_FOLDER } = require('./constants')
const log = console.log

/**
 * deploy local json database
 */
async function deployDB (dist = DOCS_FOLDER) {
  try {
    const dbFolderPath = path.resolve(__dirname, `../${dist}/db`)
    await fs.ensureDir(dbFolderPath)
    const dbFile = `${dist}/db/db.json`
    const adapter = new FileSync(dbFile)
    const db = lowdb(adapter)
    db.defaults({ source: [] }).write()
    return db
  } catch (error) {
    log(chalk.red(`[m-doc]: ${error}`))
  }
}

module.exports = {
  deployDB
}
