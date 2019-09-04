var BasePlug = require('../../BasePlug')
var education_web_process = new BasePlug()
module.exports = {
  // 操作框标题
  title: '锐目教育前端文件',


  //  运行时会切换到该目录环境下
  cwd: 'D:\\RZL\\git\\zhenan\\zajy-web',
  //  运行的命令
  cmd: 'npm',
  // 运行的参数
  arg: ['run', 'start'],

  //  检测命令文件是否存在
  fileExists: false,
  //  默认发送控制台数据
  isSendConsoleData: false,
  //  按钮组
  button: [
    {
      //  按钮标题
      title: '启用', 
      //  触发事件
      action: 'apply'
    }
  ],
  file: {
    //uploadPath: 'D:\\RZL\\git\\nuxt\\education_web\\.nuxt',
    deployPath: 'D:\\RZL\\git\\nuxt\\education_web\\.nuxt\\dist'
  },
  actions: {
    apply: function(req, res, next) {
      
    }
  }
}