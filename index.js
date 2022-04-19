/**
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http')

const PORT = 3000

const server = http.createServer((req, res) => {
  res.end('Hello World')
})

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT} now`)
})
