var zip = require('./utils/zip.js')
var ws = require('./ws.js')
var fs = require('fs')
function BasePlug() {
  // 操作框标题
  this.title = '锐目教育前端文件'
  this.accept = '.zip'
  //  运行时会切换到该目录环境下
  this.cwd = 'D:\\RZL\\git\\zhenan\\zajy-web'
  //  运行的命令
  this.cmd = 'cnpm.cmd'
  // 运行的参数
  this.arg = ['run', 'start']
  //  默认发送控制台数据
  this.isSendConsoleData = false
  //上传进度
  this.uploadProgress = 0
  //  显示选择器
  this.selecter = true
  //  显示上传按钮
  this.uploader = true
  //  当前运行版本
  this.$version = null
  // 获取所有上传的版本
  this.$versionList = []
  // 日志记录
  this.$proInfo = []
  // 日志记录
  this.$info = []
  // 是否显示日志窗口
  this.$logShow = false
  //  按钮组
  this.button = [
    {
      //  按钮标题
      title: '运行', 
      //  触发事件
      action: 'applyPlug'
    },
    {
      //  按钮标题
      title: '解压', 
      //  触发事件
      action: 'deployZip'
    },
    {
      title: '停止运行', 
      action: 'stop'
    },
    {
      title: '重启', 
      action: 'restart'
    }
  ],
  this.deployPath = 'D:\\RZL\\git\\nuxt\\education_web\\.nuxt\\dist',
  //  如果这里执行来返回res.json就不用next了
  //  如果设置来actions 就不会执行$actions
  this.actions = {
    apply: function(req, res, next) {
      this.$actions.apply(req, res, next)
    }
  },
  this.$actions = {
    deployZip: function(req, res, next) {
      var version = req.body.plug.$version
      if (!version) {
        return res.json({ code: -1, msg: '没有找到版本号' })
      }
      var srcPath = this.$cacheDir + '/upload/' + version
      if (!fs.existsSync(srcPath)) {
        return res.json({ code: -1, msg: '没有找到版本号' })
      }
      var destPath = this.deployPath
      zip.unzip(srcPath, destPath, () => {
        this.saveVersion(version)
        res.json({ code: 0, msg: '运行成功' })
        this.sendInfoToClient('前端版本： ' + version)
      })
    },
    stop: function(req, res, next) {
      this.$exe.stop()
      next()
    },
    applyPlug: function(req, res, next) {
      this.$exe.start()
      next()
    }
  }
  this.afterUpload = function(req, res) {

  }
  //  进程启动前，一般用于替换参数 启动文件变更
  this.onBeforeStart = function() {

  }
}

BasePlug.prototype.readVersion = function() {
  if (fs.existsSync('./cache/' + this.$model + '/' + this.$name + '/version')) {
    return fs.readFileSync('./cache/' + this.$model + '/' + this.$name + '/version', 'utf8')
  } else {
    return null
  }
}

BasePlug.prototype.readVersionList = function() {
  return fs.readdirSync(this.getUploadDir())
}

BasePlug.prototype.saveVersion = function(version) {
  return fs.writeFileSync('./cache/' + this.$model + '/' + this.$name + '/version', version, 'utf8')
}

BasePlug.prototype.getUploadDir = function() {
  return './cache/' + this.$model + '/' + this.$name + '/upload'
}

BasePlug.prototype.unzip = function(src , dist, cb) {
  zip.unzip(src, dist, cb)
}

BasePlug.prototype.fileLog = function(str) {
  var fileFormat = this.plug.logFileFormat ? this.plug.logFileFormat : 'YYYY-MM-DD-HH:mm:ss'
  var filePath = './cache' + this.plug.$model + '/' + '' + moment().format(fileFormat) + '.log'
  var s = moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + str + '\n'
  fs.appendFileSync(filePath, s)
}

BasePlug.prototype.sendInfoToClient = function (data) {
  ws.forEach((client) => {
    client.json({ act: 'info', data: data, $model: this.$model,$name: this.$name })
  })
}

BasePlug.prototype.sendProInfoToClient = function (data) {
  ws.forEach((client) => {
    if (client.listens && client.listens.length > 0 ) {
      if (client.listens.indexOf(this.$name) > -1) {
        client.json({ act: 'proInfo', data: data, $model: this.$model,$name: this.$name  })  
      }
    }
  })
}

BasePlug.prototype.onError = function(data) {
  this.sendProInfoToClient(data)
}

BasePlug.prototype.onData = function(data) {
  this.sendProInfoToClient(data)
}

BasePlug.prototype.onControlData = function(data) {
  console.log(data)
  this.sendInfoToClient(data)
}

module.exports = BasePlug