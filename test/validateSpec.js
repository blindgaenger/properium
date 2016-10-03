'use strict'

const expect = require('chai').expect

const validateProp = require('../lib/validate').validateProp
const ProperiumError = require('../lib/error').ProperiumError

describe('validate', () => {
  describe('validateProp', () => {
    it ('returns the object after validate', () => {
      const object = { id: 'FOO' }
      const prop = { name: 'id', name: 'id' }
      const result = validateProp('root', object, prop)
      expect(result).to.equal(object)
    })

    describe('prop', () => {
      it('rejects undefined props', () => {
        const object = {}
        const prop = { name: 'id', name: 'id' }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'undefined prop')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows prop with a value of undefined', () => {
        const object = { id: undefined }
        const prop = { name: 'id', name: 'id' }
        validateProp('root', object, prop)
      })
    })

    describe('required', () => {
      it('rejects an undefined value', () => {
        const object = { id: undefined }
        const prop = { name: 'id', name: 'id', required: true }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'required value')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows a defined value', () => {
        const object = { id: 'FOO' }
        const prop = { name: 'id', name: 'id', required: true }
        validateProp('root', object, prop)
      })
    })

    describe('oneOf', () => {
      it('rejects an unknown value', () => {
        const object = { id: 'QUX' }
        const prop = { name: 'id', oneOf: ['FOO', 'BAR'] }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'unknown value')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows a known value', () => {
        const object = { id: 'FOO' }
        const prop = { name: 'id', oneOf: ['FOO', 'BAR'] }
        validateProp('root', object, prop)
      })
    })

    describe('type', () => {
      describe('string', () => {
        it('rejects', () => {
          const object = { id: 42 }
          const prop = { name: 'id', type: 'string' }
          expect(() => validateProp('root', object, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const object = { id: 'FOO' }
          const prop = { name: 'id', type: 'string' }
          validateProp('root', object, prop)
        })
      })

      describe('number', () => {
        it('rejects', () => {
          const object = { id: 'FOO' }
          const prop = { name: 'id', type: 'number' }
          expect(() => validateProp('root', object, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const object = { id: 42 }
          const prop = { name: 'id', type: 'number' }
          validateProp('root', object, prop)
        })
      })

      describe('array', () => {
        it('rejects', () => {
          const object = { id: 'FOO' }
          const prop = { name: 'id', type: 'array' }
          expect(() => validateProp('root', object, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const object = { id: [] }
          const prop = { name: 'id', type: 'array' }
          validateProp('root', object, prop)
        })
      })

      describe('object', () => {
        it('rejects', () => {
          const object = { id: 'FOO' }
          const prop = { name: 'id', type: 'object' }
          expect(() => validateProp('root', object, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          const object = { id: {} }
          const prop = { name: 'id', type: 'object' }
          validateProp('root', object, prop)
        })
      })

      describe('Class', () => {
        it('rejects', () => {
          class ID {
          }
          const object = { id: 'FOO' }
          const prop = { name: 'id', type: ID }
          expect(() => validateProp('root', object, prop))
            .to.throw(ProperiumError, 'invalid type')
            .and.to.have.property('prop', 'root.id')
        })

        it('allows', () => {
          class ID {
          }
          const object = { id: new ID() }
          const prop = { name: 'id', type: ID }
          validateProp('root', object, prop)
        })
      })

      // TODO: describe.skip('array[]', () => {})
      // TODO: describe.skip('enum[]', () => {})
    })

    describe('length', () => {
      it('rejects non length objects', () => {
        const object = { id: 42 }
        const prop = { name: 'id', length: 1 }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects lower than length', () => {
        const object = { id: ['FOO'] }
        const prop = { name: 'id', length: 2 }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects higher than length', () => {
        const object = { id: ['FOO', 'BAR'] }
        const prop = { name: 'id', length: 1 }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows exact length', () => {
        const object = { id: ['FOO'] }
        const prop = { name: 'id', length: 1 }
        validateProp('root', object, prop)
      })

      it('rejects lower than range', () => {
        const object = { id: ['FOO'] }
        const prop = { name: 'id', length: [2, 3] }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects higher than range', () => {
        const object = { id: ['FOO', 'BAR'] }
        const prop = { name: 'id', length: [0, 1] }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'invalid length')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows max length', () => {
        const prop = { name: 'id', length: [undefined, 1] }
        validateProp('root', { id: [] }, prop)
        validateProp('root', { id: ['FOO'] }, prop)
      })

      it('allows min length', () => {
        const prop = { name: 'id', length: [1, undefined] }
        validateProp('root', { id: ['FOO'] }, prop)
        validateProp('root', { id: ['FOO', 'BAR'] }, prop)
      })

      it('allows arrays', () => {
        const prop = { name: 'id', length: [1, 1] }
        validateProp('root', { id: ['FOO'] }, prop)
      })

      it('allows strings', () => {
        const prop = { name: 'id', length: [2, 3] }
        validateProp('root', { id: 'FO' }, prop)
        validateProp('root', { id: 'FOO' }, prop)
      })
    })

    describe('subtype', () => {
      it('rejects non arrays', () => {
        const object = { id: 'FOO' }
        const prop = { name: 'id', subtype: 'string' }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'invalid subtype')
          .and.to.have.property('prop', 'root.id')
      })

      it('rejects an invalid subtype', () => {
        const object = { id: [42] }
        const prop = { name: 'id', subtype: 'string' }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'invalid type')
          .and.to.have.property('prop', 'root.id.[0]')
      })

      it('allows a defined value', () => {
        const object = { id: ['FOO'] }
        const prop = { name: 'id', subtype: 'string' }
        validateProp('root', object, prop)
      })
    })

    describe('validate', () => {
      it('rejects an invalid prop', () => {
        class ID {
          validate() {
            throw new ProperiumError('SOURCE', 'MESSAGE')
          }
        }
        const object = { id: new ID() }
        const prop = { name: 'id', name: 'id' }
        expect(() => validateProp('root', object, prop))
          .to.throw(ProperiumError, 'MESSAGE')
          .and.to.have.property('prop', 'SOURCE')
      })

      it('allows a valid prop', () => {
        class ID {
          validate() {}
        }
        const object = { id: new ID() }
        const prop = { name: 'id', name: 'id' }
        validateProp('root', object, prop)
      })

      it('ignores non-validatable', () => {
        class ID {}
        const object = { id: new ID() }
        const prop = { name: 'id', name: 'id' }
        validateProp('root', object, prop)
      })
    })
  })
})
