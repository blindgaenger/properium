'use strict'

const _ = require('lodash')
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

class ProperiumError extends ExtendableError {
  static fail(propPath, message, details) {
    const prop = _.compact(_.flattenDeep([propPath])).join('.')
    throw new ProperiumError(prop, message, details)
  }

  constructor(prop, text, details) {
    assert(prop, 'prop must be set')
    assert(text, 'text must be set')
    let message = `${prop}: ${text}`
    if (details) message = `${message} (${details})`
    super(message)
    this.prop = prop
    this.text = text
    this.details = details
  }
}

module.exports = {
  ProperiumError
}
