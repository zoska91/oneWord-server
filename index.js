#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './app.js'
import debug from 'debug'
import http from 'http'
import ngrok from 'ngrok'

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '8080')
app.set('port', port)

// /**
//  * Create HTTP server.
//  */

const server = http.createServer(app)

// /**
//  * Listen on provided port, on all network interfaces.
//  */

server.listen(port, async () => {
  ngrok
    .connect(port)
    .then((ngrokUrl) => {
      console.log(`Ngrok tunnel in: ${ngrokUrl}`) // Log the ngrok URL once the tunnel is established
    })
    .catch((error) => {
      console.log(`Couldn't tunnel ngrok: ${error}`) // Log an error if ngrok fails to start
    })
})
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}
