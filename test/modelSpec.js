'use strict'

const expect = require('chai').expect

const PropModel = require('../lib/model').PropModel
const PropError = require('../lib/error').PropError

describe('model', () => {
  it('fails for unknown properties', () => {
    class Person extends PropModel {}

    const person = new Person()
    person.name = 'FOO'

    expect(() => person.validate())
      .to.throw(PropError, 'unknown prop')
      .and.to.have.property('prop', 'name')
  })

  it('fails for undefined properties', () => {
    class Person extends PropModel {}
    Person.defineProp('name', {})

    const person = new Person()

    expect(() => person.validate())
      .to.throw(PropError, 'undefined prop')
      .and.to.have.property('prop', 'name')
  })

  it('fails for nested properties', () => {
    class Pet extends PropModel {}
    Pet.defineProp('name', { type: 'string' })

    class Person extends PropModel {}
    Person.defineProp('pet', { type: Pet })

    const person = new Person()
    person.pet = new Pet()

    expect(() => person.validate('root'))
      .to.throw(PropError, 'undefined prop')
      .and.to.have.property('prop', 'root.pet.name')
  })

  it('passes for defined properties', () => {
    class Person extends PropModel {}
    Person.defineProp('name', {})

    const person = new Person()
    person.name = 'FOO'

    person.validate()
  })
})
