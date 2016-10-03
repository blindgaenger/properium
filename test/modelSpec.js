'use strict'

const expect = require('chai').expect

const ProperiumModel = require('../lib/model').ProperiumModel
const ProperiumError = require('../lib/error').ProperiumError

describe('model', () => {
  it('inits primitive props with cloned defaultValue', () => {
    const FOO_ARRAY = ['FOO']
    class Person extends ProperiumModel {}
    Person.defineProp('friends', { defaultValue: FOO_ARRAY })

    const person = new Person()
    person.friends.push('BAR')
    expect(person.friends).to.deep.equal(['FOO', 'BAR'])

    const newPerson = new Person()
    expect(newPerson.friends).to.deep.equal(['FOO'])
  })

  it('inits class props with defaultValue', () => {
    class Name {}
    class Person extends ProperiumModel {}
    Person.defineProp('name', { defaultValue: Name })

    const person = new Person()

    expect(person.name).to.be.instanceOf(Name)
  })

  it('inits function props with defaultValue', () => {
    const initName = () => 'FOO'
    class Person extends ProperiumModel {}
    Person.defineProp('name', { defaultValue: initName })

    const person = new Person()

    expect(person.name).to.equal('FOO')
  })

  it('fails for if invalid', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', {})

    const person = new Person()

    expect(() => person.validate())
      .to.throw(ProperiumError, 'undefined prop')
      .and.to.have.property('prop', 'name')
  })

  it('returns the model after validate', () => {
    class Person extends ProperiumModel {}
    const person = new Person()

    const result = person.validate()

    expect(result).to.equal(person)
  })
})
