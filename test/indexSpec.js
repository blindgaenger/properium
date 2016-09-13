'use strict'

const expect = require('chai').expect

const ProperiumModel = require('../lib/index').ProperiumModel
const ProperiumError = require('../lib/index').ProperiumError

describe('example', () => {
  it('fails', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', { type: 'string' })

    const person = new Person()
    person.name = 42

    expect(() => person.validate('root'))
      .to.throw(ProperiumError, 'invalid type')
      .and.to.have.property('prop', 'root.name')
  })

  it('works', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', { type: 'string' })

    const person = new Person()
    person.name = 'Foo'

    person.validate('root')
  })
})
