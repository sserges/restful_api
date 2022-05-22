/**
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http')
const https = require('https')
const fs = require('fs')

const config = require('./config')
const unifiedServer = require('./lib/unified_server')

const HTTP_PORT = config.httpPort
const HTTPS_PORT = config.httpsPort
const ENV_NAME = config.envName

// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

// Start the HTTP server
httpServer.listen(HTTP_PORT, () => {
  console.log(
    `The server is listening on port ${HTTP_PORT} in ${ENV_NAME} mode`
  )
})

// Instantiate the HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})

// Start the HTTPS server
httpsServer.listen(HTTPS_PORT, () => {
  console.log(
    `The server is listening on port ${HTTPS_PORT} in ${ENV_NAME} mode`
  )
})
