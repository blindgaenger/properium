'use strict'

const expect = require('chai').expect

const ProperiumModel = require('../lib/index').ProperiumModel
const ProperiumError = require('../lib/index').ProperiumError

describe('use cases', () => {
  it('fails', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', { type: 'string' })

    const person = new Person()
    person.name = 42

    expect(() => person.validate('root'))
      .to.throw(ProperiumError, 'invalid type')
      .and.to.have.property('prop', 'root.name')
  })

  it('works with defaults', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', { type: 'string', required: true })
    Person.defineProp('friends', { type: 'array', subtype: 'string', defaultValue: [] })

    const alice = new Person()
    alice.name = 'ALICE'
    alice.friends.push('BOB')
    alice.validate('alice')

    expect(alice.name).to.equal('ALICE')
    expect(alice.friends).to.deep.equal(['BOB'])

    const oscar = new Person()
    oscar.name = 'OSCAR'
    oscar.validate('oscar')

    expect(oscar.name).to.equal('OSCAR')
    expect(oscar.friends).to.deep.equal([])
  })

  it('works with extends', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', { type: 'string', required: true })

    class Friend extends Person {}
    Friend.defineProp('nickname', { type: 'string', required: true })

    const person = new Person()
    person.name = 'Foo'
    person.validate('person')
  })
})
