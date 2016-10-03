'use strict'

const expect = require('chai').expect

const validateProp = require('../lib/validate').validateProp
const validateValue = require('../lib/validate').validateValue
const ProperiumError = require('../lib/error').ProperiumError

describe('validate', () => {
  describe('validateProp', () => {
    describe('prop', () => {
      it('rejects undefined props', () => {
        const object = {}
        const prop = { name: 'id' }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'undefined prop')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows prop with a value of undefined', () => {
        const object = { id: undefined }
        const prop = { name: 'id' }
        validateProp('root', object, prop)
      })
    })

    describe('defaultValue', () => {
      it('allows undefined props', () => {
        const object = {}
        const prop = { name: 'id', defaultValue: 'DEFAULT' }
        validateProp('root', object, prop)
        expect(object.id).to.equal('DEFAULT')
      })

      it('allows the original value', () => {
        const object = { id: 'ORIGINAL'}
        const prop = { name: 'id', defaultValue: 'DEFAULT' }
        validateProp('root', object, prop)
        expect(object.id).to.equal('ORIGINAL')
      })
    })

    it ('returns the object after validate', () => {
      const object = { id: 'FOO' }
      const prop = { name: 'id' }
      const result = validateProp('root', object, prop)
      expect(result).to.equal(object)
    })
  })

  describe('validateValue', () => {
    describe('required', () => {
      it('rejects an undefined value', () => {
        const value = undefined
        const prop = { required: true }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'required value')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows a defined value', () => {
        const value = 'FOO'
        const prop = { required: true }
        validateValue(['root', 'id'], value, prop)
      })
    })

    describe('oneOf', () => {
      it('rejects an unknown value', () => {
        const value = 'QUX'
        const prop = { oneOf: ['FOO', 'BAR'] }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'unknown value')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows a known value', () => {
        const value = 'FOO'
        const prop = { oneOf: ['FOO', 'BAR'] }
        validateValue(['root', 'id'], value, prop)
      })
    })

    describe('type', () => {
      describe('string', () => {
        it('rejects', () => {
          const value = 42
          const prop = { type: 'string' }
          expect(() => validateValue(['root', 'id'], value, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const value = 'FOO'
          const prop = { type: 'string' }
          validateValue(['root', 'id'], value, prop)
        })
      })

      describe('number', () => {
        it('rejects', () => {
          const value = 'FOO'
          const prop = { type: 'number' }
          expect(() => validateValue(['root', 'id'], value, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const value = 42
          const prop = { type: 'number' }
          validateValue(['root', 'id'], value, prop)
        })
      })

      describe('array', () => {
        it('rejects', () => {
          const value = 'FOO'
          const prop = { type: 'array' }
          expect(() => validateValue(['root', 'id'], value, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const value = []
          const prop = { type: 'array' }
          validateValue(['root', 'id'], value, prop)
        })
      })

      describe('object', () => {
        it('rejects', () => {
          const value = 'FOO'
          const prop = { type: 'object' }
          expect(() => validateValue(['root', 'id'], value, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const value = {}
          const prop = { type: 'object' }
          validateValue(['root', 'id'], value, prop)
        })
      })

      describe('Class', () => {
        it('rejects', () => {
          class ID {
          }
          const value = 'FOO'
          const prop = { type: ID }
          expect(() => validateValue(['root', 'id'], value, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          class ID {
          }
          const value = new ID()
          const prop = { type: ID }
          validateValue(['root', 'id'], value, prop)
        })
      })

      // TODO: describe.skip('array[]', () => {})
      // TODO: describe.skip('enum[]', () => {})
    })

    describe('length', () => {
      it('rejects non length objects', () => {
        const value = 42
        const prop = { length: 1 }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects lower than length', () => {
        const value = ['FOO']
        const prop = { length: 2 }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects higher than length', () => {
        const value = ['FOO', 'BAR']
        const prop = { length: 1 }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows exact length', () => {
        const value = ['FOO']
        const prop = { length: 1 }
        validateValue(['root', 'id'], value, prop)
      })

      it('rejects lower than range', () => {
        const value = ['FOO']
        const prop = { length: [2, 3] }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects higher than range', () => {
        const value = ['FOO', 'BAR']
        const prop = { length: [0, 1] }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows max length', () => {
        const prop = { length: [undefined, 1] }
        validateValue(['root', 'id'], [], prop)
        validateValue(['root', 'id'], ['FOO'], prop)
      })

      it('allows min length', () => {
        const prop = { length: [1, undefined] }
        validateValue(['root', 'id'], ['FOO'], prop)
        validateValue(['root', 'id'], ['FOO', 'BAR'], prop)
      })

      it('allows arrays', () => {
        const prop = { length: [1, 1] }
        validateValue(['root', 'id'], ['FOO'], prop)
      })

      it('allows strings', () => {
        const prop = { length: [2, 3] }
        validateValue(['root', 'id'], 'FO', prop)
        validateValue(['root', 'id'], 'FOO', prop)
      })
    })

    describe('subtype', () => {
      it('rejects non arrays', () => {
        const value = 'FOO'
        const prop = { subtype: 'string' }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'invalid subtype')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects an invalid subtype', () => {
        const value = [42]
        const prop = { subtype: 'string' }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'invalid type')
          .and.to.have.property('prop', 'root.id.[0]')
      })

      it('allows a defined value', () => {
        const value = ['FOO']
        const prop = { subtype: 'string' }
        validateValue(['root', 'id'], value, prop)
      })
    })

    describe('validate', () => {
      it('rejects an invalid prop', () => {
        class ID {
          validate() {
            throw new ProperiumError('SOURCE', 'MESSAGE')
          }
        }
        const value = new ID()
        const prop = { name: 'id' }
        expect(() => validateValue(['root', 'id'], value, prop))
          .to.throw(ProperiumError, 'MESSAGE')
          .and.to.have.property('prop', 'SOURCE')
      })

      it('allows a valid prop', () => {
        class ID {
          validate() {}
        }
        const value = new ID()
        const prop = { name: 'id' }
        validateValue(['root', 'id'], value, prop)
      })

      it('ignores non-validatable', () => {
        class ID {}
        const value = new ID()
        const prop = { name: 'id' }
        validateValue(['root', 'id'], value, prop)
      })
    })
  })
})
