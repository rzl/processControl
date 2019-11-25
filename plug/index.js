var fs = require('fs')
var MyExe = require('./utils/MyExe')

function PlugManage(opt) {
  this.cache = './cache'
  this.modelMap = {}
  this.plugMap = {}
  this.initCache(this.cache)
  fs.readdirSync(__dirname + '/modules' ).forEach((name) => {
    this.registModel(name)
  })
}

PlugManage.prototype.getPlug = function(modelName, plugName) {
  var modelMap = this.modelMap
  if (modelMap[modelName] && modelMap[modelName][plugName]) {
    return modelMap[modelName][plugName]
  } else {
    return null
  }
}

PlugManage.prototype.getPlugByPlug = function(plug) {
  return this.getPlug(plug.$model, plug.$name)
}

PlugManage.prototype.findPlug = function(plugName) {
  var modelMap = this.modelMap
  for (var x in modelMap) {
    for (var i in modelMap[x]['$plugs']) {
      if (i === plugName) {
        return modelMap[x]['$plugs'][i]
      }
    }
  }
  return null
}

PlugManage.prototype.registModel = function (modelName) {
  var cacheDir = this.cache + '/' + modelName
  this.initCache( cacheDir )
  if (!this.modelMap[modelName]) {
    this.modelMap[modelName] = {}
    this.modelMap[modelName].$cacheDir = cacheDir
  }
  if (fs.existsSync(__dirname +  '/modules/' + modelName + '/index.js')) {
    this.modelMap[modelName] = require(__dirname +  '/modules/' + modelName)
    this.modelMap[modelName]['$model'] = modelName
  }
  for (var x in this.modelMap[modelName]['$plugs']) {
    this.registPlug(modelName, x, this.modelMap[modelName]['$plugs'][x])
  }
}

PlugManage.prototype.registPlug = function (modelName, plugName, plug) {
  var cacheDir = this.cache + '/' + modelName + '/' + plugName 
  this.initCache(cacheDir)
  this.initCache(cacheDir + '/upload')
  this.modelMap[modelName][plugName] = plug
  plug.$cacheDir = cacheDir
  plug.$model = modelName
  plug.$name = plugName
  plug.$version = plug.readVersion()
  plug.$versionList = plug.readVersionList()
  plug.$exe = new MyExe(plug)
  plug.$exe.onError = (str) => {
    plug.onError(str)
  }
  plug.$exe.onData = (str) => {
    plug.onData(str)
  }
  plug.$exe.onControlData = (str) => {
    plug.onControlData(str)
  }
}

PlugManage.prototype.deleteModel = function (model) {
  for (var x in this.modelMap[modelName]) {
    this.deletePlug(this.modelMap[modelName[x]])
  }
  delete require.cache[model.$modelFilePath];
  delete this.modelMap[model.$name]
}

PlugManage.prototype.deletePlug = function (plug) {
  plug.$exe.stop()
  delete require.cache[plug.$plugFilePath];
  delete this.modelMap[plug.$model][plug.$name]
}

PlugManage.prototype.initCache = function (cacheName) {
  fs.existsSync(cacheName) || fs.mkdir(cacheName)
}


module.exports = PlugManage
