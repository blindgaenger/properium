'use strict'

const expect = require('chai').expect

const PropError = require('../lib/index').PropError
const PropModel = require('../lib/index').PropModel

describe('example', () => {
  it('fails', () => {
    class Person extends PropModel {}
    Person.defineProp('name', { type: 'string' })

    const person = new Person()
    person.name = 42

    expect(() => person.validate('root'))
      .to.throw(PropError, 'invalid type')
      .and.to.have.property('prop', 'root.name')
  })

  it('works', () => {
    class Person extends PropModel {}
    Person.defineProp('name', { type: 'string' })

    const person = new Person()
    person.name = 'Foo'

    person.validate('root')
  })
})
