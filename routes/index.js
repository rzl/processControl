var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var moment = require('moment')

//var multer  = require('multer');
var upload = multer({dest: 'jarBack/'});
var jarExe = {}
var frontVersion = {}
var zip = {}
/* GET home page. */
router.get('/plug', function(req, res, next){
  console.log(req.app.plug)
  return res.json({data: req.app.plug.modelMap})
})

router.get('/', function(req, res, next) {
  req.session.isLogin = true
  if (req.session.isLogin !== true) {
    return res.redirect('login')
  }
  res.render('index', { 
    title: 'Express'
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
    var plug = req.app.plug.getPlug(req.body.model,req.body.name)
    if (!plug) {
      return res.json({
        code: -1,
        msg: '上传成功，但是找不到对应的插件'
      })
    }
    var newFileName = req.files[0].originalname.replace(plug.accept, moment().format('-YYYY-MM-DD-HH-mm-ss') + plug.accept)
    var newFilePath = plug.$cacheDir + '/upload/' + newFileName
    fs.renameSync(req.files[0].path, newFilePath)
    if (fs.existsSync(newFilePath)) {
      plug.afterUpload(req, res)
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
  var plug = req.app.plug.getPlugByPlug(req.body.plug)
  if (!plug) {
    return res.json({ code: -1, msg: '找不到对应的插件' })
  } 
  var fn = null
  var action = req.body.action
  if (plug.actions[action]) {
    fn = plug.actions[action]
  } else if (plug.$actions[action]) {
    fn = plug.$actions[action]
  } else {
    return res.json({ code: -1, msg: '插件未定义方法' + action })
  }
  fn.apply(plug, [req, res, () => {
    res.json({ code: 0, msg: '运行成功'})  
  }])
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
    console.log('close',ws.index)
    global.ws.splice(ws.index, 1)
  })
  ws.on('error', () => {
    console.log('ws error')
    global.ws.splice(ws.index, 1)
  })
  ws.json = function(str) {
    ws.send(JSON.stringify(str))
  }
  console.log(global.ws.length)
});


module.exports = router;
