'use strict'

const assert = require('assert')

// ExtendableError: http://stackoverflow.com/a/32749533
class ExtendableError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

class PropError extends ExtendableError {
  constructor(prop, message) {
    assert(prop, 'prop must be set')
    assert(message, 'message must be set')
    super(message)
    this.prop = prop
  }
}

function failProp(prop, message) {
  throw new PropError(prop, message || 'invalid prop');
}

module.exports = {
  PropError,
  failProp
}
