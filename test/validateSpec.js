'use strict'

const expect = require('chai').expect

const validate = require('../lib/validate').validate
const ProperiumError = require('../lib/error').ProperiumError

describe('validate', () => {
  describe('prop', () => {
    it('rejects undefined props', () => {
      const object = {}
      const validation = { prop: 'id' }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'undefined prop')
        .and.to.have.property('prop', 'root.id')
    })

    it('allows prop with a value of undefined', () => {
      const object = { id: undefined }
      const validation = { prop: 'id' }
      validate('root', object, validation)
    })
  })

  describe('defaultValue', () => {
    it('allows undefined props', () => {
      const object = {}
      const validation = { prop: 'id', defaultValue: 'DEFAULT' }
      validate('root', object, validation)
      expect(object.id).to.equal('DEFAULT')
    })

    it('allows the original value', () => {
      const object = { id: 'ORIGINAL'}
      const validation = { prop: 'id', defaultValue: 'DEFAULT' }
      validate('root', object, validation)
      expect(object.id).to.equal('ORIGINAL')
    })
  })

  describe('required', () => {
    it('rejects an undefined value', () => {
      const object = { id: undefined }
      const validation = { prop: 'id', required: true }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'required value')
        .and.to.have.property('prop', 'root.id')
    })

    it('allows a defined value', () => {
      const object = { id: 'FOO' }
      const validation = { prop: 'id', required: true }
      validate('root', object, validation)
    })
  })

  describe('oneOf', () => {
    it('rejects an unknown value', () => {
      const object = { id: 'QUX' }
      const validation = { prop: 'id', oneOf: ['FOO', 'BAR'] }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'unknown value')
        .and.to.have.property('prop', 'root.id')
    })

    it('allows a known value', () => {
      const object = { id: 'FOO' }
      const validation = { prop: 'id', oneOf: ['FOO', 'BAR'] }
      validate('root', object, validation)
    })
  })

  describe('type', () => {
    describe('string', () => {
      it('rejects', () => {
        const object = { id: 42 }
        const validation = { prop: 'id', type: 'string' }
        expect(() => validate('root', object, validation))
          .to.throw(ProperiumError, 'invalid type')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows', () => {
        const object = { id: 'FOO' }
        const validation = { prop: 'id', type: 'string' }
        validate('root', object, validation)
      })
    })

    describe('number', () => {
      it('rejects', () => {
        const object = { id: 'FOO' }
        const validation = { prop: 'id', type: 'number' }
        expect(() => validate('root', object, validation))
          .to.throw(ProperiumError, 'invalid type')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows', () => {
        const object = { id: 42 }
        const validation = { prop: 'id', type: 'number' }
        validate('root', object, validation)
      })
    })

    describe('array', () => {
      it('rejects', () => {
        const object = { id: 'FOO' }
        const validation = { prop: 'id', type: 'array' }
        expect(() => validate('root', object, validation))
          .to.throw(ProperiumError, 'invalid type')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows', () => {
        const object = { id: [] }
        const validation = { prop: 'id', type: 'array' }
        validate('root', object, validation)
      })
    })

    describe('object', () => {
      it('rejects', () => {
        const object = { id: 'FOO' }
        const validation = { prop: 'id', type: 'object' }
        expect(() => validate('root', object, validation))
          .to.throw(ProperiumError, 'invalid type')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows', () => {
        const object = { id: {} }
        const validation = { prop: 'id', type: 'object' }
        validate('root', object, validation)
      })
    })

    describe('Class', () => {
      it('rejects', () => {
        class ID {
        }
        const object = { id: 'FOO' }
        const validation = { prop: 'id', type: ID }
        expect(() => validate('root', object, validation))
          .to.throw(ProperiumError, 'invalid type')
          .and.to.have.property('prop', 'root.id')
      })

      it('allows', () => {
        class ID {
        }
        const object = { id: new ID() }
        const validation = { prop: 'id', type: ID }
        validate('root', object, validation)
      })
    })

    describe.skip('array[]', () => {})

    describe.skip('enum[]', () => {})
  })

  describe('length', () => {
    it('rejects non length objects', () => {
      const object = { id: 42 }
      const validation = { prop: 'id', length: 1 }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'invalid length')
        .and.to.have.property('prop', 'root.id')
    })

    it('rejects lower than length', () => {
      const object = { id: ['FOO'] }
      const validation = { prop: 'id', length: 2 }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'invalid length')
        .and.to.have.property('prop', 'root.id')
    })

    it('rejects higher than length', () => {
      const object = { id: ['FOO', 'BAR'] }
      const validation = { prop: 'id', length: 1 }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'invalid length')
        .and.to.have.property('prop', 'root.id')
    })

    it('allows exact length', () => {
      const object = { id: ['FOO'] }
      const validation = { prop: 'id', length: 1 }
      validate('root', object, validation)
    })

    it('rejects lower than range', () => {
      const object = { id: ['FOO'] }
      const validation = { prop: 'id', length: [2, 3] }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'invalid length')
        .and.to.have.property('prop', 'root.id')
    })

    it('rejects higher than range', () => {
      const object = { id: ['FOO', 'BAR'] }
      const validation = { prop: 'id', length: [0, 1] }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'invalid length')
        .and.to.have.property('prop', 'root.id')
    })

    it('allows max length', () => {
      const validation = { prop: 'id', length: [undefined, 1] }
      validate('root', { id: [] }, validation)
      validate('root', { id: ['FOO'] }, validation)
    })

    it('allows min length', () => {
      const validation = { prop: 'id', length: [1, undefined] }
      validate('root', { id: ['FOO'] }, validation)
      validate('root', { id: ['FOO', 'BAR'] }, validation)
    })

    it('allows arrays', () => {
      const validation = { prop: 'id', length: [1, 1] }
      validate('root', { id: ['FOO'] }, validation)
    })

    it('allows strings', () => {
      const validation = { prop: 'id', length: [2, 3] }
      validate('root', { id: 'FO' }, validation)
      validate('root', { id: 'FOO' }, validation)
    })
  })

  describe('subtype', () => {
    it('rejects non arrays', () => {
      const object = { id: 'FOO' }
      const validation = { prop: 'id', subtype: 'string' }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'invalid subtype')
        .and.to.have.property('prop', 'root.id')
    })

    it('rejects an invalid subtype', () => {
      const object = { id: [42] }
      const validation = { prop: 'id', subtype: 'string' }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'invalid type')
        .and.to.have.property('prop', 'root.id.[0]')
    })

    it('allows a defined value', () => {
      const object = { id: ['FOO'] }
      const validation = { prop: 'id', subtype: 'string' }
      validate('root', object, validation)
    })
  })

  describe('validate', () => {
    it('rejects an invalid prop', () => {
      class ID {
        validate () {
          throw new ProperiumError('SOURCE', 'MESSAGE')
        }
      }
      const object = { id: new ID() }
      const validation = { prop: 'id' }
      expect(() => validate('root', object, validation))
        .to.throw(ProperiumError, 'MESSAGE')
        .and.to.have.property('prop', 'SOURCE')
    })

    it('allows a valid prop', () => {
      class ID {
        validate () {}
      }
      const object = { id: new ID() }
      const validation = { prop: 'id' }
      validate('root', object, validation)
    })

    it('ignores non-validatable', () => {
      class ID {}
      const object = { id: new ID() }
      const validation = { prop: 'id' }
      validate('root', object, validation)
    })

    it ('returns the object after validate', () => {
      const object = { id: 'FOO' }
      const validation = { prop: 'id' }
      const result = validate('root', object, validation)
      expect(result).to.equal(object)
    })
  })
})
