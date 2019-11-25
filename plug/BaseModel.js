var fs = require('fs')
function BaseModel() {
  this.title = 'BaseModel'
  this.$info = []
  this.$proInfo = []
  this.$plugs = {}
}

BaseModel.prototype.loadPlug = function (dir) {
  var plugs = fs.readdirSync(dir).filter((name) => {
    return name !== 'index.js'
  })
  plugs.forEach((p) => {
    this.$plugs[p.replace('.js', '')] = require(dir + '/' + p)
  })
}
module.exports = BaseModel