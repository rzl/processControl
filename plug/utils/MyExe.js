const { spawn } = require('child_process')

var fs = require('fs')
var moment = require('moment')

function MyExe(plug) {
  this.getPlug = function() {
    return plug
  }
  this.onData = function() {}
  this.onError = function() {}
  this.onControlData = function() {}

}

MyExe.prototype.start = function () {
  var plug = this.getPlug()
  var file = plug.readVersion()

  plug.onBeforeStart()

  var aprocess = spawn(plug.cmd, plug.arg, { cwd: plug.cwd });
  this.$exe = aprocess
  aprocess.isLive = true

  aprocess.stdout.on('data', (data) => {
    data = data.toString('utf8')
    this.onData(data)
  });

  aprocess.stderr.on('data', (data) => {
    data = data.toString('utf8')
    this.onError(data)
  });

  aprocess.on('close', (code) => {
    aprocess.isLive = false
    var str = file + ' ' + aprocess.pid + '' + '关闭程序程序'
    this.onControlData(str)
  });

  var str = file + aprocess.pid + '启动程序'
  this.onControlData(str)
}


MyExe.prototype.stop = function() {
  this.$exe.kill()
  this.$exe.isLive = false
  this.onControlData(this.$exe.pid + '关闭程序程序')
}

MyExe.prototype.restart = function() {
  if (this.$exe.pid) { stop() }
  start()
}

MyExe.prototype.run = function() {
  restart()
}



module.exports = MyExe;