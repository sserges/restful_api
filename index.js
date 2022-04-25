/**
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http')
const url = require('url')

const PORT = 3000

const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true)

  // Get the path
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the HTTP method
  const method = req.method.toLowerCase()

  res.end('Hello World')

  console.log(`Request received on path: ${trimmedPath} with method ${method}`)
})

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT} now`)
})
