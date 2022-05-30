const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

const handlers = require('./handlers')
const helpers = require('./helpers')

// Define a request router
const router = {
  sample: handlers.sample,
  ping: handlers.ping,
  users: handlers.users,
}

// All the server logic for both the http and https server
const unifiedServer = (req, res) => {
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

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', (data) => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()

    // Choose the handler this request should go to
    const chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    }

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200
      // Use the payload called back by the handler, or default to empty object
      payload = typeof payload == 'object' ? payload : {}

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload)

      console.log('Returning this response: ', statusCode, payloadString)

      // Return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
    })
  })
}

module.exports = unifiedServer
