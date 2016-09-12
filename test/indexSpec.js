'use strict'

const expect = require('chai').expect
const say = require('../lib/index').say

describe('say', () => {
  it('works', () => {
    expect(say('world')).to.equal('Hello, world!')
  })
})
