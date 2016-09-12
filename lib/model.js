'use strict'

const _validate = require('./validate').validate

class PropModel {
  static defineProp(prop, validation) {
    this._validations = this._validations || []
    this._validations.push(Object.assign({ prop }, validation))
  }

  validate(propPath) {
    const validations = this.constructor._validations || []
    validations.forEach(validation => _validate(propPath, this, validation))
  }
}

module.exports = {
  PropModel
}
