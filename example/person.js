'use strict'

const PropModel = require('../lib/index').PropModel
const PropError = require('../lib/index').PropError

class Friend extends PropModel {}
Friend.defineProp('name', { type: 'string', required: true })
Friend.defineProp('gender', { type: 'string', oneOf: ['f', 'm'] })

class Person extends PropModel {}
Person.defineProp('name', { type: 'string', required: true })
Person.defineProp('age', { type: 'number', required: false })
Person.defineProp('friends', { type: 'array', subtype: Friend, defaultValue: [] })

const person = new Person()
person.name = 'Fred'
person.age = 42
person.friends = []

const friend = new Friend()
friend.name = 'Amy'
friend.gender = 'f'

try {
  person.validate('person')
  console.log(JSON.stringify(person, null, 2))
} catch (err) {
  if (err instanceof PropError) {
    console.error(err)
  } else {
    throw err
  }
}
