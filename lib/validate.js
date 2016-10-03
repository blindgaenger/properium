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

function _findTypeValidator(type) {
  const isType = TYPE_VALIDATORS[type] || type.isType
  if (isType) return isType
  if (_.isObject(type)) return TYPE_VALIDATORS.instance
}

function _formatTypeName(type) {
  return type.name || type
}

function _formatValueTypeName(value) {
  return value.constructor && value.constructor.name || typeof value
}

// TODO: _.isNull, _.isEmpty
function _assertRequired(propPath, value, prop) {
  const required = prop.required
  if (required) {
    if (_.isUndefined(value)) ProperiumError.fail(propPath, 'required value')
  }
}

function _assertOneOf(propPath, value, prop) {
  const oneOf = prop.oneOf
  if (oneOf) {
    if (!_.includes(oneOf, value)) ProperiumError.fail(propPath, 'unknown value', `expected oneOf [${oneOf.join(', ')}], but is ${value}`)
  }
}

function _assertType(propPath, value, prop) {
  const type = prop.type
  if (type) {
    const isType = _findTypeValidator(type)
    if (!isType) ProperiumError.fail(propPath, 'invalid type', `expected ${_formatTypeName(type)}, but is ${_formatValueTypeName(value)}`)
    if (!isType(value, type)) ProperiumError.fail(propPath, 'invalid type', `expected ${_formatTypeName(type)}, but is ${_formatValueTypeName(value)}`)
  }
}

function _assertLength(propPath, value, prop) {
  const type = prop.type
  const length = prop.length
  if (length) {
    if (!_.has(value, 'length')) ProperiumError.fail(propPath, 'invalid length', `length expected for type ${type}`)
    if (_.isArray(length)) {
      const min = length[0]
      const max = length[1]
      if (min && value.length < min || max && value.length > max) ProperiumError.fail(propPath, 'invalid length', `expected [${min || ''}..${max || ''}], but is ${value.length}`)
    } else {
      if (value.length !== length) ProperiumError.fail(propPath, 'invalid length', `expected ${length}, but is ${value.length}`)
    }
  }
}

function _assertSubtype(propPath, value, prop) {
  const type = prop.type
  const subtype = prop.subtype
  if (subtype) {
    if (!_.isArray(value)) ProperiumError.fail(propPath, 'invalid subtype', `subtype given for type ${type}`)

    value.forEach((subvalue, index) => {
      validateProp(propPath, value, { name: `[${index}]`, type: subtype })
    })
  }
}

function validateProp(rootPath, object, prop) {
  const propName = prop.name
  const propPath = [rootPath, propName]

  const defaultValue = prop.defaultValue
  if (!_.has(object, propName)) {
    if (!defaultValue) ProperiumError.fail(propPath, 'undefined prop')
    _.set(object, propName, defaultValue)
  }

  const value = _.get(object, propName)
  _assertRequired(propPath, value, prop)
  _assertOneOf(propPath, value, prop)
  _assertType(propPath, value, prop)
  _assertLength(propPath, value, prop)
  _assertSubtype(propPath, value, prop)

  if (value && value.validate) {
    value.validate(propPath)
  }

  return object
}

module.exports = {
  validateProp,
}
