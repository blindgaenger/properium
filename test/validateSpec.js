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
        const validation = { prop: 'id' }
        expect(() => validateProp('root', object, validation))
          .to.throw(ProperiumError, 'undefined prop')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows prop with a value of undefined', () => {
        const object = { id: undefined }
        const validation = { prop: 'id' }
        validateProp('root', object, validation)
      })
    })

    describe('defaultValue', () => {
      it('allows undefined props', () => {
        const object = {}
        const validation = { prop: 'id', defaultValue: 'DEFAULT' }
        validateProp('root', object, validation)
        expect(object.id).to.equal('DEFAULT')
      })

      it('allows the original value', () => {
        const object = { id: 'ORIGINAL'}
        const validation = { prop: 'id', defaultValue: 'DEFAULT' }
        validateProp('root', object, validation)
        expect(object.id).to.equal('ORIGINAL')
      })
    })

    it ('returns the object after validate', () => {
      const object = { id: 'FOO' }
      const validation = { prop: 'id' }
      const result = validateProp('root', object, validation)
      expect(result).to.equal(object)
    })
  })

  describe('validateValue', () => {
    describe('required', () => {
      it('rejects an undefined value', () => {
        const value = undefined
        const validation = { required: true }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'required value')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows a defined value', () => {
        const value = 'FOO'
        const validation = { required: true }
        validateValue(['root', 'id'], value, validation)
      })
    })

    describe('oneOf', () => {
      it('rejects an unknown value', () => {
        const value = 'QUX'
        const validation = { oneOf: ['FOO', 'BAR'] }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'unknown value')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows a known value', () => {
        const value = 'FOO'
        const validation = { oneOf: ['FOO', 'BAR'] }
        validateValue(['root', 'id'], value, validation)
      })
    })

    describe('type', () => {
      describe('string', () => {
        it('rejects', () => {
          const value = 42
          const validation = { type: 'string' }
          expect(() => validateValue(['root', 'id'], value, validation))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const value = 'FOO'
          const validation = { type: 'string' }
          validateValue(['root', 'id'], value, validation)
        })
      })

      describe('number', () => {
        it('rejects', () => {
          const value = 'FOO'
          const validation = { type: 'number' }
          expect(() => validateValue(['root', 'id'], value, validation))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const value = 42
          const validation = { type: 'number' }
          validateValue(['root', 'id'], value, validation)
        })
      })

      describe('array', () => {
        it('rejects', () => {
          const value = 'FOO'
          const validation = { type: 'array' }
          expect(() => validateValue(['root', 'id'], value, validation))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const value = []
          const validation = { type: 'array' }
          validateValue(['root', 'id'], value, validation)
        })
      })

      describe('object', () => {
        it('rejects', () => {
          const value = 'FOO'
          const validation = { type: 'object' }
          expect(() => validateValue(['root', 'id'], value, validation))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const value = {}
          const validation = { type: 'object' }
          validateValue(['root', 'id'], value, validation)
        })
      })

      describe('Class', () => {
        it('rejects', () => {
          class ID {
          }
          const value = 'FOO'
          const validation = { type: ID }
          expect(() => validateValue(['root', 'id'], value, validation))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          class ID {
          }
          const value = new ID()
          const validation = { type: ID }
          validateValue(['root', 'id'], value, validation)
        })
      })

      // TODO: describe.skip('array[]', () => {})
      // TODO: describe.skip('enum[]', () => {})
    })

    describe('length', () => {
      it('rejects non length objects', () => {
        const value = 42
        const validation = { length: 1 }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects lower than length', () => {
        const value = ['FOO']
        const validation = { length: 2 }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects higher than length', () => {
        const value = ['FOO', 'BAR']
        const validation = { length: 1 }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows exact length', () => {
        const value = ['FOO']
        const validation = { length: 1 }
        validateValue(['root', 'id'], value, validation)
      })

      it('rejects lower than range', () => {
        const value = ['FOO']
        const validation = { length: [2, 3] }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects higher than range', () => {
        const value = ['FOO', 'BAR']
        const validation = { length: [0, 1] }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows max length', () => {
        const validation = { length: [undefined, 1] }
        validateValue(['root', 'id'], [], validation)
        validateValue(['root', 'id'], ['FOO'], validation)
      })

      it('allows min length', () => {
        const validation = { length: [1, undefined] }
        validateValue(['root', 'id'], ['FOO'], validation)
        validateValue(['root', 'id'], ['FOO', 'BAR'], validation)
      })

      it('allows arrays', () => {
        const validation = { length: [1, 1] }
        validateValue(['root', 'id'], ['FOO'], validation)
      })

      it('allows strings', () => {
        const validation = { length: [2, 3] }
        validateValue(['root', 'id'], 'FO', validation)
        validateValue(['root', 'id'], 'FOO', validation)
      })
    })

    describe('subtype', () => {
      it('rejects non arrays', () => {
        const value = 'FOO'
        const validation = { subtype: 'string' }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'invalid subtype')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects an invalid subtype', () => {
        const value = [42]
        const validation = { subtype: 'string' }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'invalid type')
          .and.to.have.property('prop', 'root.id.[0]')
      })

      it('allows a defined value', () => {
        const value = ['FOO']
        const validation = { subtype: 'string' }
        validateValue(['root', 'id'], value, validation)
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
        const validation = { prop: 'id' }
        expect(() => validateValue(['root', 'id'], value, validation))
          .to.throw(ProperiumError, 'MESSAGE')
          .and.to.have.property('prop', 'SOURCE')
      })

      it('allows a valid prop', () => {
        class ID {
          validate() {}
        }
        const value = new ID()
        const validation = { prop: 'id' }
        validateValue(['root', 'id'], value, validation)
      })

      it('ignores non-validatable', () => {
        class ID {}
        const value = new ID()
        const validation = { prop: 'id' }
        validateValue(['root', 'id'], value, validation)
      })
    })
  })
})
