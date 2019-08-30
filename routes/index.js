var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var moment = require('moment')

//var multer  = require('multer');
var upload = multer({dest: 'jarBack/'});
var jarExe = require('../modules/jarExe')
var frontVersion = require('../modules/frontVersion')
var zip = require('../modules/zip')
/* GET home page. */

router.get('/', function(req, res, next) {
  if (req.session.isLogin !== true) {
    //req.session.isLogin = true
    return res.redirect('login')
  }
  global.frontFile = frontVersion.readVersion()
  res.render('index', { 
    title: 'Express',
    files: fs.readdirSync('./').filter((dir) => { if (dir.indexOf('.jar') > -1) { return dir } }),
    frontFiles: fs.readdirSync(global.config.frontDir).filter((dir) => { if (dir.indexOf('.zip') > -1) { return dir } }),
    jarFile: global.jarFile,
    frontFile: global.frontFile
  });
});

router.get('/login', function(req, res, next) {
  res.end(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
      </head>
      <body style="text-align: center">
        <div style="height: 50px"></div>
          <form action="/login" method="POST" style="">
              密码: <input type="password" name="password"/>
              <input type="submit" value="Submit"/>
          </form>
      </body>
      </html>
    `);
})

router.post('/login', function(req, res, next) {
  if (req.body.password === global.config.password) {
    req.session.isLogin = true
    return res.redirect('/')
  } else {
    return res.redirect('login')
  }
});

router.get('/loginOut', function(req, res, next) {
  req.session.isLogin = false
  return res.redirect('/login')
});

router.post('/', upload.any(), function(req, res, next) {
    console.log(req.files);  // 上传的文件信息
    newFileName = req.files[0].originalname.replace('.jar', moment().format('-YYYY-MM-DD-HH-mm-ss') + '.jar')
    fs.renameSync(req.files[0].path, newFileName)
    if (fs.existsSync(newFileName)) {
      res.json({
        code: 0,
        msg: '上传成功',
        data: newFileName
      })
    } else {
      res.json({
        code: -1,
        msg: '上传失败'
      })
    }
});

router.post('/front', upload.any(), function(req, res, next) {
    console.log(req.files);  // 上传的文件信息
    newFileName = req.files[0].originalname.replace('.zip', moment().format('-YYYY-MM-DD-HH-mm-ss') + '.zip')
    newFilePathName = global.config.frontDir + '/' + newFileName
    fs.renameSync(req.files[0].path, newFilePathName)
    if (fs.existsSync(newFilePathName)) {
      res.json({
        code: 0,
        msg: '上传成功',
        data: newFileName
      })
    } else {
      res.json({
        code: -1,
        msg: '上传失败'
      })
    }
});

router.post('/action', function(req, res, next) {
  if (req.session.isLogin !== true) {
    return res.json( { code: -1, msg: '登录超时'} )
  }
  if (req.body.action === undefined) {
    return res.json({ code: -1, msg: '没有指令'})
  }
  var jarFile = req.body.jarFile
  switch(req.body.action) {
    case 'restart':
      jarExe.restart(req.body.jarFile)
    break
    case 'stop':
      jarExe.stop(req.body.jarFile)
    break
    case 'deleteJar':
      if (!fs.existsSync('jarBack')) {
        fs.mkdirSync('jarBack')
      }
      fs.renameSync(req.body.jarFile, 'jarBack/' + req.body.jarFile)
      return res.json({ code: 0, msg: '删除成功' })
    break
  }
  res.json({ code: 0, msg: '运行成功'})
})

router.post('/frontAction', function(req, res, next) {
  if (req.session.isLogin !== true) {
    return res.json( { code: -1, msg: '登录超时'} )
  }
  if (req.body.action === undefined) {
    return res.json({ code: -1, msg: '没有指令'})
  }
  var frontFile = req.body.frontFile
  switch(req.body.action) {
    case 'setFront':
      var src = global.config.frontDir + '/' + req.body.frontFile
      var dest = global.config.frontDir
      zip.unzip(src, dest, () => {
        frontVersion.saveVersion(req.body.frontFile)
        global.frontFile = req.body.frontFile
        res.json({ code: 0, msg: '应用成功' })
        jarExe.sendInfoToClient('前端版本： ' + global.frontFile)
      })
    break
    case 'deleteFront':
      var dir = global.config.frontDir + '/zipBack'
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      fs.renameSync(global.config.frontDir + '/' + req.body.frontFile, dir + '/' +req.body.frontFile)
      return res.json({ code: 0, msg: '删除成功' })
    break
  }
})

router.ws('/', function(ws, req) {
  var length = global.ws.push(ws)
  ws.index = length - 1
  ws.on('message', function(msg) {
    console.log(msg);
  });
  ws.on('close', () => {
    console.log(ws.index)
    global.ws.splice(ws.index, 1)
  })
  ws.on('error', () => {
    console.log('ws error')
    global.ws.splice(ws.index, 1)
  })
  ws.json = function(str) {
    ws.send(JSON.stringify(str))
  }
  ws.json({
    act: 'info',
    data: '当前运行文件：' + global.jarFile +'\n'
  })
  var str = ''
  if (jarExe.aprocessStatus.aprocess.isLive === true) {
    str = '运行中 pid：' + jarExe.aprocessStatus.aprocess.pid + '\n'
  } else {
    str = '已关闭\n'
  }
  ws.json({
    act: 'info',
    data: '运行状态： ' + str + '前端版本： ' + global.frontFile + '\n'
  })
  console.log(global.ws.length)
});


module.exports = router;
