var fs = require('fs')

function readVersion(m, p) {
  if (fs.existsSync( + '/version')) {
    return fs.readFileSync('./cache/' + m + '/' + p + '/version', 'utf8')
  }
}

function saveVersion(m, p) {
  return fs.writeFileSync('./cache/' + m + '/' + p + '/version', str, 'utf8')
}

module.exports = {saveVersion, readVersion};