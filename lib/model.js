'use strict'

const _ = require('lodash')

const ProperiumError = require('./error').ProperiumError
const _validateProp = require('./validate').validateProp

class ProperiumModel {
  static get props() {
    this._props = this._props || []
    if (this._props === Object.getPrototypeOf(this).props) {
      this._props = _.cloneDeep(this._props)
    }
    return this._props
  }

  static defineProp(name, prop) {
    this.props.push(Object.assign({ name }, prop))
  }

  constructor() {
    // initialize the object with the default values
    this.constructor.props.forEach(prop => {
      if (!_.isUndefined(prop.defaultValue)) {
        const value = prop.defaultValue
        if (value.prototype instanceof Object) {
          this[prop.name] = new value()
        } else if (_.isFunction(value)) {
          this[prop.name] = value()
        } else {
          this[prop.name] = _.cloneDeep(value)
        }
      }
    })
  }

  validate(propPath) {
    const propNames = _.map(this.constructor.props, 'name')
    _.keys(this).forEach(propName => {
      if (!_.includes(propNames, propName)) ProperiumError.fail([propPath, propName], 'unknown prop')
    })

    this.constructor.props.forEach(prop => _validateProp(propPath, this, prop))

    return this
  }
}

module.exports = {
  ProperiumModel
}
