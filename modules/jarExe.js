const { spawn } = require('child_process')

var fs = require('fs')
var moment = require('moment')

var aprocessStatus = { 
  aprocess: {}
}
var logFileName = 'aprocessupdate.txt'
var client = {}


function sendInfoToClient(data) {
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

function fileLog(str) {
  var s = moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + str + '\n'
  fs.appendFileSync(logFileName, s)
  sendInfoToClient(s)
}

function start(file) {
  if (!file) { return }
  if (!fs.existsSync(file)) { 
    log(file + '文件不存在')
    sendInfoToClient(file + '文件不存在')
    return 
  }

  process.title = file
  global.jarFile = file
  
  var aprocess = spawn('java', ['-jar', global.config.Xms, global.config.Xmx, file]);
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



module.exports = {restart, stop, aprocessStatus, sendInfoToClient};