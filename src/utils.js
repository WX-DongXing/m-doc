const os = require('os')

/**
 * get local ip address
 * @returns {string}
 */
function getIPAddress () {
  const interfaces = os.networkInterfaces()
  return Object.values(interfaces).reduce((acc, cur) => {
    if (cur.some(item => item.family === 'IPv4' && !item.internal)) {
      const target = cur.find(inter => inter.family === 'IPv4')
      acc = target.address
    }
    return acc
  }, '')
}

module.exports = {
  getIPAddress
}
