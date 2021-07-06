'use strict';

const assert = require('assert')
const Leet = require('../lib/leetscript.js')
const l = new Leet(true);

describe('leetscript tests with simple option', () => {
  it('should convert to basic leet with simple option set', () => {
    let simpleMap = {
      "leetscript": "13375c2ip7",
      "kevingimbel": "k3vin6im831",
      "node scripts": "n0d3 5c2ip75",
      "cli tools": "c1i 70015"
    }
    let strings = Object.keys(simpleMap)

    strings.forEach( (str) => {
      assert.equal(simpleMap[str], l.encode(str))
    })
  })

  it('should ignore numbers', () => {
    let numbers = [0,123,345653,82723,918273,73625,483626]
    numbers.forEach( (n) => {
      assert.equal(n, l.encode(n))
    })
  })

  it('should return objects, arrays, and empty strings as they are', () => {
    let nonStr = [[], {a: 12, b: "test"}, ""]

    nonStr.forEach( (item) => {
      assert.equal(item, l.encode(item))
    })
  })

  it('should return false for falsey values', () => {
    let illegal = [null, false, undefined]

    illegal.forEach( (item) => {
      assert.equal(false, l.encode(item))
    })
  })

  it('should replace uppercase letters as expected', () => {
    let testMap = {
      "Leet": "1337",
      "Lorem": "1023m",
      "Key": "k3y",
      "ZeRo": "2320",
    }
    let strings = Object.keys(testMap)

    strings.forEach( (word) => {
      assert.equal(testMap[word], l.encode(word))
    })
  })
})
