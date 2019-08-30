var fs = require('fs')

function readVersion() {
  if (fs.existsSync(config.frontDir + '/frontFile')) {
    return fs.readFileSync(config.frontDir + '/frontFile', 'utf8')
  }
}

function saveVersion(str) {
  return fs.writeFileSync(config.frontDir + '/frontFile', str, 'utf8')
}

module.exports = {saveVersion, readVersion};