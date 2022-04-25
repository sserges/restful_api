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

  // Get the query string as an object
  const queryStringObject = parsedUrl.query

  // Get the HTTP method
  const method = req.method.toLowerCase()

  // Get the headers as an object
  const headers = req.headers

  res.end('Hello World')

  console.log(
    `Request received on path: ${trimmedPath} with method ${method} and with these query string parameters`
  )
  console.log(queryStringObject)
  console.log('headers', headers)
})

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT} now`)
})
