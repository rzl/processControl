var fs = require('fs')
console.log(__dirname)
var modules = fs.readdirSync(__dirname + '/modules' ).map((name) => {
  return require(__dirname +  '/modules/' + name)
})
console.log(modules)