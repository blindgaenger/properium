'use strict'

const _ = require('lodash')

const ProperiumError = require('./error').ProperiumError
const _validate = require('./validate').validate

class ProperiumModel {
  static defineProp(prop, validation) {
    this._validations = this._validations || []
    this._validations.push(Object.assign({ prop }, validation))
  }

  constructor() {
    const validations = this.constructor._validations || []
    validations.forEach(validation => {
      if (!_.isUndefined(validation.defaultValue)) {
        this[validation.prop] = validation.defaultValue
      }
    })
  }

  validate(propPath) {
    const validations = this.constructor._validations || []

    const propNames = _.map(validations, 'prop')
    _.keys(this).forEach(propName => {
      if (!_.includes(propNames, propName)) ProperiumError.fail([propPath, propName], 'unknown prop')
    })

    validations.forEach(validation => _validate(propPath, this, validation))
  }
}

module.exports = {
  ProperiumModel
}
