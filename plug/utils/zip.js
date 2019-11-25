var fs = require('fs')
var JSZip = require('jszip')
var iconv = require('iconv-lite')
var path = require("path")

function mkdirsSync(dirname) {  
    //console.log(dirname);  
    if (fs.existsSync(dirname)) {  
        return true;  
    } else {  
        if (mkdirsSync(path.dirname(dirname))) {  
            fs.mkdirSync(dirname);  
            return true;  
        }  
    }  
}  

function unzip(src, dst, cb) {
  var zip = new JSZip
  var suffixes = '.zip'
  if (suffixes.indexOf(src.split('.').pop().toLowerCase())>0){
    if (dst) {
      if(!fs.existsSync(dst)){
        throw new Error('path error')
      }
    }
    var preDir = './'
    fs.readFile(src, function(err, data) {
        if (dst === undefined) {
          dst = preDir
        } else {
          var b = dst.charAt(dst.length - 1)
          if (b != '/') {dst += '/'}
          dst += preDir
        }
        fs.existsSync(dst) || fs.mkdirSync(dst)
        //console.log('a:'+dst)
        if (err) throw err;
        zip.loadAsync(data, {decodeFileName: function(bytes){
          var str = iconv.decode(Buffer.from(bytes), 'utf8')
          if(str.indexOf('�') != -1) {
            return iconv.decode(Buffer.from(bytes), 'GBK')
          }
          return str
        }}).then(function (azip) {
          //console.log(azip.files)
          for (var x in azip.files) {
            if(azip.files[x].dir) {
              fs.existsSync(dst + x) || mkdirsSync(dst + x)
            } else {
              ((name) => {                 
                azip.file(x).async('uint8array').then(_ => {
                  ((name, buf) => {
                    //console.log(name)
                    fs.writeFileSync(dst + name, buf , { encoding: null } ,  _=>{})
                  })(name, _)
                })
              })(x)
            }
          }
          cb(err, data)
        });
    });
  }
}

module.exports = { unzip }
