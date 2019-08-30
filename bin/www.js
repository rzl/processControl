var argv = process.argv.splice(2);
var firstJar = argv[0]
//require('ejs');
var fs = require('fs')
global.config = {
  port: 3000,
  password: '123456',
  Xms: '-Xms768m',
  Xmx: '-Xmx4096m',
  frontDir: 'public'
}
global.ws = []

var configFileName = 'server.json'
if (fs.existsSync(configFileName)) {
  var userConfig = JSON.parse(fs.readFileSync(configFileName, 'utf-8'))
  Object.assign(config, userConfig)
}

var app = require('../app');
return
//var debug = require('debug')('jarUpdate:server');
var http = require('http');

var jarExe = require('../modules/jarExe')
if (firstJar != undefined) {
  jarExe.restart(firstJar)
}
/**
 * Get port from environment and store in Express.
 */
console.log(config)
var port = normalizePort(process.env.PORT || config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var expressWs = require('express-ws')(app, server);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  //debug('Listening on ' + bind);
}