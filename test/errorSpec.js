'use strict'

const expect = require('chai').expect
const AssertionError = require('assert').AssertionError

const ProperiumError = require('../lib/error').ProperiumError

describe('error', () => {
  it('builds the error message', () => {
    expect(() => ProperiumError.fail('PROP', 'TEXT', 'DETAILS'))
      .to.throw(ProperiumError, 'PROP: TEXT (DETAILS)')
  })

  it('requires a prop', () => {
    expect(() => ProperiumError.fail(undefined, 'TEXT'))
      .to.throw(AssertionError, 'prop must be set')
  })

  it('requires a text', () => {
    expect(() => ProperiumError.fail('PROP', undefined))
      .to.throw(AssertionError, 'text must be set')
  })

  it('optionally has details', () => {
    expect(() => ProperiumError.fail('PROP', 'TEXT'))
      .to.throw(ProperiumError, 'PROP: TEXT')
  })

  it('flattens the prop to a path', () => {
    expect(() => ProperiumError.fail(['ROOT', undefined, ['FOO', 'BAR'], 'PROP'], 'TEXT'))
      .to.throw(ProperiumError, 'ROOT.FOO.BAR.PROP: TEXT')
  })
})
