'use strict'

const _ = require('lodash')

const ProperiumError = require('./error').ProperiumError

const TYPE_VALIDATORS = {
  array: (value) => _.isArray(value),
  boolean: (value) => _.isBoolean(value),
  float: (value) => _.isNumber(value),
  integer: (value) => _.isInteger(value),
  number: (value, type) => typeof value === type,
  object: (value) => _.isObject(value),
  string: (value, type) => typeof value === type,
  instance: (value, type) => value instanceof type
}

function _findTypeValidator (type) {
  const isType = TYPE_VALIDATORS[type] || type.isType
  if (isType) return isType
  if (_.isObject(type)) return TYPE_VALIDATORS.instance
}

function _formatTypeName (type) {
  return type.name || type
}

function _formatValueTypeName (value) {
  return value.constructor && value.constructor.name || typeof value
}

function validate (propPath, object, validation) {
  const prop = validation.prop

  const defaultValue = validation.defaultValue
  if (!_.has(object, prop)) {
    if (!defaultValue) ProperiumError.fail([propPath, prop], 'undefined prop')
    _.set(object, prop, defaultValue)
  }
  const value = _.get(object, prop)

  const required = validation.required
  if (_.isUndefined(value)) { // TODO: _.isNull, _.isEmpty
    if (required) ProperiumError.fail([propPath, prop], 'required value')
    return // nothing to do
  }

  const oneOf = validation.oneOf
  if (oneOf) {
    if (!_.includes(oneOf, value)) ProperiumError.fail([propPath, prop], 'unknown value', `expected oneOf [${oneOf.join(', ')}], but is ${value}`)
  }

  const type = validation.type
  if (type) {
    const isType = _findTypeValidator(type)
    if (!isType) ProperiumError.fail([propPath, prop], 'invalid type', `expected ${_formatTypeName(type)}, but is ${_formatValueTypeName(value)}`)
    if (!isType(value, type)) ProperiumError.fail([propPath, prop], 'invalid type', `expected ${_formatTypeName(type)}, but is ${_formatValueTypeName(value)}`)
  }

  const length = validation.length
  if (length) {
    if (!_.has(value, 'length')) ProperiumError.fail([propPath, prop], 'invalid length', `length expected for type ${type}`)
    if (_.isArray(length)) {
      const min = length[0]
      const max = length[1]
      if (min && value.length < min || max && value.length > max) ProperiumError.fail([propPath, prop], 'invalid length', `expected [${min || ''}..${max || ''}], but is ${value.length}`)
    } else {
      if (value.length !== length) ProperiumError.fail([propPath, prop], 'invalid length', `expected ${length}, but is ${value.length}`)
    }
  }

  const subtype = validation.subtype
  if (subtype) {
    if (!_.isArray(value)) ProperiumError.fail([propPath, prop], 'invalid subtype', `subtype given for type ${type}`)

    value.forEach((subvalue, index) => {
      validate([propPath, prop], value, { prop: `[${index}]`, type: subtype })
    })
  }

  if (value.validate) {
    value.validate([propPath, prop])
  }

  return object
}

module.exports = {
  validate
}
