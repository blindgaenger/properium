'use strict'

const _ = require('lodash')

const _validateProps = require('./validate').validateProps

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
    this._initWithDefaultValues(this, this.constructor.props)
  }

  validate(propPath) {
    return _validateProps(propPath, this, this.constructor.props)
  }

  _initWithDefaultValues(object, props) {
    props.forEach(prop => {
      if (!_.isUndefined(prop.defaultValue)) {
        const value = prop.defaultValue
        if (value.prototype instanceof Object) {
          object[prop.name] = new value() // eslint-disable-line new-cap
        } else if (_.isFunction(value)) {
          object[prop.name] = value()
        } else {
          object[prop.name] = _.cloneDeep(value)
        }
      }
    })
  }
}

module.exports = {
  ProperiumModel
}
