var fs = require('fs')
fs.existsSync('./cache') || fs.mkdir('./cache')
var modules = {}
fs.readdirSync(__dirname + '/modules' ).forEach((name) => {
  if (fs.existsSync(__dirname +  '/modules/' + name + '/index.js')) {
    fs.existsSync('./cache/' + name) || fs.mkdir('./cache/' + name)
    modules[name] = require(__dirname +  '/modules/' + name)
    modules[name]['$model'] = name
  }
})

module.exports = modules