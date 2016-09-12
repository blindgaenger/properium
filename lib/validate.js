'use strict'

const failProp = require('./error').failProp

function validate(propPath, object, validation) {
  const prop = validation.prop
  const type = validation.type
  if (typeof object[prop] !== type) failProp(`${propPath}.${prop}`, 'invalid type')
}

module.exports = {
  validate
}
