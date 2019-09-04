var d = require('./education_web_process.js')
var d1 = require('./education_web_process1.js')
console.log(this)
module.exports = {
  // 显示在tab上的标题
  title: 'education_web',
  //  插件默认激活状态
  enable: true,
  //
  process: [d,d1]
}