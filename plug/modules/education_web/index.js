var d = require('./education_web_process.js')
console.log(d)
module.exports = {
  // 显示在tab上的标题
  title: 'education_web',
  //  插件默认激活状态
  enable: true,
  //
  process: [d]
}