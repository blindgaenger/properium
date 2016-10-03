'use strict'

const _ = require('lodash')

const ProperiumError = require('./error').ProperiumError
const _validateProp = require('./validate').validateProp

class ProperiumModel {
  static get validations() {
    this._validations = this._validations || []
    if (this._validations === Object.getPrototypeOf(this).validations) {
      this._validations = _.cloneDeep(this._validations)
    }
    return this._validations
  }

  static defineProp(prop, validation) {
    this.validations.push(Object.assign({ prop }, validation))
  }

  constructor() {
    this.constructor.validations.forEach(validation => {
      if (!_.isUndefined(validation.defaultValue)) {
        const value = validation.defaultValue
        if (value.prototype instanceof Object) {
          this[validation.prop] = new value()
        } else if (_.isFunction(value)) {
          this[validation.prop] = value()
        } else {
          this[validation.prop] = _.cloneDeep(value)
        }
      }
    })
  }

  validate(propPath) {
    const propNames = _.map(this.constructor.validations, 'prop')
    _.keys(this).forEach(propName => {
      if (!_.includes(propNames, propName)) ProperiumError.fail([propPath, propName], 'unknown prop')
    })

    this.constructor.validations.forEach(validation => _validateProp(propPath, this, validation))

    return this
  }
}

module.exports = {
  ProperiumModel
}
