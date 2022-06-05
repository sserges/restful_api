/*
 * Request handlers
 *
 */

// Dependencies
const _data = require('./data')
const helpers = require('./helpers')

// Define the handlers
const handlers = {}

// Container for the users submethods
handlers._users = {}

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
  // Check that all required fields are filled out
  let firstName = false
  let lastName = false
  let phone = false
  let password = false
  let tosAgreement = false

  if (
    typeof data.payload.firstName == 'string' &&
    data.payload.firstName.trim().length > 0
  ) {
    firstName = data.payload.firstName.trim()
  }

  if (
    typeof data.payload.lastName == 'string' &&
    data.payload.lastName.trim().length > 0
  ) {
    lastName = data.payload.lastName.trim()
  }

  if (
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length == 10
  ) {
    phone = data.payload.phone.trim()
  }

  if (
    typeof data.payload.password == 'string' &&
    data.payload.password.trim().length > 0
  ) {
    password = data.payload.password.trim()
  }

  if (
    typeof data.payload.tosAgreement == 'boolean' &&
    data.payload.tosAgreement
  ) {
    tosAgreement = true
  }

  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure that the user doesn't already exist
    _data.read('users', phone, (err, data) => {
      if (err) {
        // Hash the password
        const hashedPassword = helpers.hash(password)

        if (hashedPassword) {
          // Create the user object
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement,
          }

          // Store the user
          _data.create('users', phone, userObject, (err) => {
            if (!err) {
              delete userObject.hashedPassword
              callback(200, userObject)
            } else {
              console.log(err)
              callback(500, { Error: 'Could not create the new user' })
            }
          })
        } else {
          callback(500, { Error: "Could not hash the user's password" })
        }
      } else {
        // user already exists
        callback(400, { Error: 'A user with that phone number already exists' })
      }
    })
  } else {
    callback(400, { Error: 'Missing required fields' })
  }
}

// Users - get
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Don't let them access anyone else's
handlers._users.get = (data, callback) => {
  // Check that the phone number is valid
  let phone = false
  if (
    typeof data.queryStringObject.phone == 'string' &&
    data.queryStringObject.phone.trim().length == 10
  ) {
    phone = data.queryStringObject.phone.trim()
  }

  if (phone) {
    // Lookup the user
    _data.read('users', phone, (err, data) => {
      if (!err && data) {
        // Remove the hashed password from the user object before returning it to the requester
        delete data.hashedPassword
        callback(200, data)
      } else {
        callback(404)
      }
    })
  } else {
    callback(400, { Error: 'Missing required field' })
  }
}

// Users - put
// Required data : phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user update their own object. Don't let them update anyone else's
handlers._users.put = (data, callback) => {
  let phone = false
  let firstName = false
  let lastName = false
  let password = false

  // Check for the required field
  if (
    typeof data.payload.phone == 'string' &&
    data.payload.phone.trim().length == 10
  ) {
    phone = data.payload.phone.trim()
  }

  // Check for the optional fields
  if (
    typeof data.payload.firstName == 'string' &&
    data.payload.firstName.trim().length > 0
  ) {
    firstName = data.payload.firstName.trim()
  }

  if (
    typeof data.payload.lastName == 'string' &&
    data.payload.lastName.trim().length > 0
  ) {
    lastName = data.payload.lastName.trim()
  }

  if (
    typeof data.payload.password == 'string' &&
    data.payload.password.trim().length > 0
  ) {
    password = data.payload.password.trim()
  }

  // Error if the phone is invalid
  if (phone) {
    // Error if nothing is sent to update
    if (firstName || lastName || password) {
      // lookup the user
      _data.read('users', phone, (err, userData) => {
        if (!err && userData) {
          // Update the fields necessary
          if (firstName) {
            userData.firstName = firstName
          }
          if (lastName) {
            userData.lastName = lastName
          }
          if (password) {
            userData.hashedPassword = helpers.hash(password)
          }

          // Store the new updates
          _data.update('users', phone, userData, (err) => {
            if (!err) {
              callback(200)
            } else {
              console.error(err)
              callback(500, { Error: 'Could not update the user' })
            }
          })
        } else {
          callback(400, { Error: 'The specified user does not exist' })
        }
      })
    } else {
      callback(400, { Error: 'Missing fields to update' })
    }
  } else {
    callback(400, { Error: 'Missing required field' })
  }
}

// Users - delete
handlers._users.delete = (data, callback) => {}

// Sample handler
handlers.sample = (data, callback) => {
  // Callback a http status code, and a payload object
  callback(406, { name: 'sample handler' })
}

// Ping handler
handlers.ping = (data, callback) => {
  callback(200)
}

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404)
}

// Users
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback)
  } else {
    callback(405)
  }
}

module.exports = handlers
