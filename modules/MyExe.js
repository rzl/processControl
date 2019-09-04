const { spawn } = require('child_process')

var fs = require('fs')
var moment = require('moment')

function MyExe(exeName, opt) {
  this.aprocessStatus = {
    aprocess: {}
  }
  this.opt = opt
  this.onData = function() {}
  this.onError = function() {}
}

MyExe.prototype.f = function () {

}

MyExe.prototype.fileLog function(str) {
  var fileFormat = this.opt.logFileFormat ? this.opt.logFileFormat : 'YYYY-MM-DD-HH:mm:ss'
  var filePath = './cache' + this.opt.$model + '/' + '' + moment().format(fileFormat) + '.log'
  var s = moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + str + '\n'
  fs.appendFileSync(filePath, s)
}

MyExe.prototype.start = function () {
  if (!file) { return }
  if (!fs.existsSync(this.opt.)) { 
    this.onError(new Error('文件不存在'))
    return 
  }

  process.title = file
  global.jarFile = file
  
  var aprocess = spawn(this.opt.cmd, this.opt.arg);
  aprocessStatus.aprocess = aprocess
  aprocess.isLive = true

  aprocess.stdout.on('data', (data) => {
    data = data.toString('utf8')
    log(data)
    sendProInfoToClient(data)
  });

  aprocess.stderr.on('data', (data) => {
    data = data.toString('utf8')
    log(data)
    sendProInfoToClient(data)
  });

  aprocess.on('close', (code) => {
    aprocess.isLive = false
    var str = file + ' ' + aprocess.pid + '' + '关闭程序程序'
    fileLog(str)
    log(str)
  });

  var str = file + aprocess.pid + '启动程序'
  log(str)
  fileLog(str)
}
/*function sendInfoToClient(data) {
  global.ws.forEach((client) => {
    client.json({ act: 'info', data: data })
  })
}

function sendProInfoToClient(data) {
  global.ws.forEach((client) => {
    client.json({ act: 'proInfo', data: data })
  })
}
function log(str) {
  console.log(str)
}
*/


function stop() {
  var aprocess = aprocessStatus.aprocess
  aprocess.kill()
  aprocess.isLive = false
  fileLog(aprocess.pid + '关闭程序程序')
}

function restart(fileName) {
  var aprocess = aprocessStatus.aprocess
  log(fileName)
  if (aprocess.pid) { stop() }
  start(fileName)
}

function run(fileName) {
  restart(fileName)
}



module.exports = MyExe;