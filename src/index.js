const baseFilter = require('./util/baseFilter.json')
const filterExp = require('./util/filterExp')
const normalizeChars = require('./util/normalizeChars')
const regex = require('./util/regex')

const firstShortWords = ['an', 'as', 'us', 'be']
const shortWords = ['it', 'at', 'xd']

function inRange(x, min, max) {
  return ((x - min) * (x - max) <= 0)
}

function resolve(content) {
  // base stuff
  content = content
    .toLowerCase()
    .replace(regex.removeRegex, '')
    .replace(/<#?@?!?&?(\d+)>/g, '') // discord mentions
    .replace(/<a?:(\w+):(\d+)>/g, '$1') // emojis (as well as discord custom emojis)
    .replace(regex.emailRegex, (...email) => {
      return `${email[1]}${email[2]}${email[6]}`.replace(regex.replaceSpots.spaces, '')
    }).replace(regex.linkRegex, (...link) => {
      return `${link[2]}`.replace(regex.replaceSpots.spaces, '')
    })
    .replace(/(\w)\1{2,}/g, '$1$1') // multiple characters only come up once

  for (const i in regex.converter.in) { // convert special character like accents and emojis into their readable counterparts
    content = content.replace(regex.converter.in[i], regex.converter.out[i])
  }

  content = normalizeChars(content)

  let res = Array(content.split(regex.replaceSpots.spaces).length + 1).fill().map(() => ({ i: [], t: '' })) // array of default objects

  content = content.split(regex.replaceSpots.spaces)

  function addSpot(text, spot, index) {
    if (!res[index]) return false
    res[index].t = text

    function checkSpots(s) { // if indexes are outside of the range of the current spot, adjust the range
      if (s < res[index].i[0]) res[index].i[0] = s
      if (s > res[index].i[1]) res[index].i[1] = s
    }

    if (Array.isArray(spot)) {
      if (res[index].i.length < 1) {
        res[index].i = spot
      } else {
        checkSpots(spot[0])
        checkSpots(spot[1])
      }
    } else {
      if (res[index].i.length < 1) {
        res[index].i = [spot, spot]
      } else {
        checkSpots(spot)
      }
    }

    return true
  }

  let spotted = 0
  const nextPushes = []

  for (let i = 0; i < content.length; i++) { // base index pushing to array
    const split = content[i]
      .replace(regex.replaceSpots.nothing, '')
      .split(regex.replaceSpots.spaces)

    for (let spI = 0; spI < split.length; spI++) {
      nextPushes.push({ i: [i, i], t: split[spI], n: true })
      addSpot(
        split[spI],
        i,
        spotted
      )
      spotted++
    }
  }

  res = nextPushes.concat(res)

  for (let i = 0; i < res.length; i++) { // combine < 3 character bits together
    const s = res[i]
    if (firstShortWords.includes(s.t)) continue

    if (s.t && (s.t.length < 3) && res[i + 1]) {
      if (s.n) continue
      if (addSpot(s.t + res[i + 1].t, s.i, i + 1)) {
        s.t = ''
        s.i = []
      }
    }
  }

  for (let i = res.length; i > -1; i--) { // combine < 3 character bits together but going backwards
    const s = res[i]
    if (!s || shortWords.includes(s.t)) continue

    if (s.t && (s.t.length < 3) && res[i - 1]) {
      if (s.n || res[i - 1].n) continue
      if (addSpot(res[i - 1].t + s.t, s.i, i - 1)) {
        s.t = ''
        s.i = []
      }
    }
  }

  // res = res.filter(x => x.t) // remove any blank spaces

  for (let i = 0; i < res.length; i++) { // combine pieces that ends and start with the same character
    const s = res[i]
    if (!s || firstShortWords.some(x => s.t.endsWith(x))) continue

    if (s.t && res[i + 1] && (s.t[s.t.length - 1] === res[i + 1].t[0])) {
      if (s.n) continue
      if (addSpot(s.t + res[i + 1].t, s.i, i + 1)) {
        s.t = ''
      }
    }
  }

  // content = res.filter(x => x.t) // remove any blank spaces (again)

  return res
}

/**
 * Swear Filter Options
 * @typedef {Object} FilterOptions
 * @prop {String[]} [swearWords=[]] The Words to Use in the Filter.
 * @prop {Boolean} [smartDetect=true] Whether you want the filter to detect words using leetspeak and and other circumvention techniques. Defaults to `true`.
 * @prop {Object} [baseFilter={}] Options for the Base Filter. (Contains Approx. 2,000 Words)
 * @prop {Boolean} [baseFilter.useBaseFilter=true] Whether or not to use the Base Filter. Defaults to `true`.
 * @prop {String[]} [baseFilter.uncensoredWords=[]] The Words to Ignore if Picked Up by the Filter.
 *
 */

class Filter {
  /**
  * Create a new Filter.
  * @param {FilterOptions} options
  * @example
  * const Filter = require("swearfilter"); 
  * 
  * const filter = new Filter({
  *     swearWords: ["bad", "words", "here"],
  *     smartDetect: true,
  *     baseFilter: {
  *         useBaseFilter: true,
  *         uncensoredWords: ["words", "to", "ignore"]
  *    }
  * });
  */

  constructor(options = {}) {

    /**
    * Swear Filter Options
    * @type {FilterOptions}
    */

    this.options = options;
    if (!this.options.swearWords) this.options.swearWords = [];
    if (this.options.smartDetect === undefined) this.options.smartDetect = true;

    if (!this.options.baseFilter) this.options.baseFilter = {};
    if (this.options.baseFilter.useBaseFilter === undefined) this.options.baseFilter.useBaseFilter = true;
    if (!this.options.baseFilter.uncensoredWords) this.options.baseFilter.uncensoredWords = [];
  }

  /**
   * @typedef {Object} FilterResponse
   * @prop {String} word The Bad Word that was Found.
   * @prop {String} filter The Filter that Contained the Bad Word.
   */

  /**
   * Test a String of Text against the Filter.
   * 
   * An Array of any Bad Words that were Found will be Returned.
   * @param {String} string The String to Test for Bad Words.
   * @returns {FilterResponse[]}
   * @example
   * const Filter = require("swearfilter");
   * 
   * const filter = new Filter({
   *     swearWords: ["bad", "words", "here"],
   *     smartDetect: true,
   *     baseFilter: {
   *         useBaseFilter: true,
   *         uncensoredWords: ["words", "to", "ignore"]
   *    }
   * });
   * 
   * filter.test("thisisbad");
   * // => [ { word: 'bad', filter: 'custom' } ]
   * 
   * filter.test("b @ d");
   * // => [ { word: 'bad', filter: 'custom' } ]
   * 
   * filter.test("b;a,..;a;.,;,d;,a.;,d;,B,;a,;D;;;g;h:f;;;d,;d");
   * // => [ { word: 'bad', filter: 'custom' } ]
   */
  test(string) {
    if (!string) return console.log("Swear Filter Error: String was not Provided.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");
    if (typeof string !== "string") return console.log("Swear Filter Error: The Parameter Provided was not of type 'string'.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");
    const content = resolve(string)
    const filterResponses = [];
    const filter = {}
    let ranges = []

    if (this.options.baseFilter.useBaseFilter) {
      filter.base = Object.keys(baseFilter).map(x => new filterExp(x, baseFilter[x]))
    }

    filter.custom = this.options.swearWords.map(x => new filterExp(x))

    if (!this.options.smartDetect) {
      if (this.options.baseFilter.useBaseFilter) {
        for (let i = 0; i < Object.keys(baseFilter).length; i++) {
          const word = Object.keys(baseFilter)[i]
          if (string.includes(word)) {
            filterResponses.push({ word, filter: 'base' })
          }
        }
      }

      for (let i = 0; i < this.options.swearWords.length; i++) {
        const word = this.options.swearWords[i]
        if (string.includes(word)) {
          filterResponses.push({ word, filter: 'custom' })
        }
      }
      return filterResponses
    }

    content.forEach(piece => {
      let done = false
      if (ranges.some(x => inRange(x[0], piece.i[0], piece.i[1]) && inRange(x[1], piece.i[0], piece.i[1]))) return
      for (const key in filter) {
        for (const part of filter[key]) {
          if (!part.test(piece.t, this.options.baseFilter.uncensoredWords)) continue
          done = true
          ranges.push(piece.i)
          filterResponses.push({ word: part.text, filter: key })
          break
        }
        if (done) break
      }
    })

    return filterResponses
  }

  /**
   * @typedef {Object} CensorOptions
   * @prop {String} [mask="*"] The String to Censor the Bad Word. Defaults to `*`.
   * @prop {"character" | "word"} [type="character"] The Type of Censoring to Use. `character` will replace each letter with the mask. `word` will replace each word with the mask. Defaults to `character`.
   */

  /**
   * Censor a String of Text.
   * @param {String} string The String for which to Censor Bad Words.
   * @param {CensorOptions} [options={}] The Options for Censoring.
   * @returns {String}
   * @example
   * const Filter = require("swearfilter");
   * 
   * const filter = new Filter({
   *     swearWords: ["frick", "beach", "bad"],
   *     smartDetect: true,
   *     baseFilter: {
   *         useBaseFilter: true,
   *         uncensoredWords: ["words", "to", "ignore"]
   *    }
   * });
   * 
   * filter.censor("Hey, frick you beach, you are bad", { mask: "*", type: "character" });
   * // => "Hey, ***** you *****, you are ***"
   * 
   * filter.censor("Hey, frick you beach, you are bad", { mask: "[bleep]", type: "word" });
   * // => "Hey, [bleep] you [bleep], you are [bleep]"
   */
  censor(string, options = {}) {
    if (!string) return console.log("Swear Filter Error: String was not Provided.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");
    if (typeof string !== "string") return console.log("Swear Filter Error: The Parameter Provided was not of type 'string'.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");
    if (!options.mask) options.mask = "*";
    if (!options.type) options.type = "character";
    if (!["character", "word"].includes(options.type)) return console.log("Swear Filter Error: The Censoring Type must be either 'character' or 'word'.\nNeed Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");

    const censor = (type, mask, string) => {
      if (type === "character") {
        return string.split('').map(x => mask).join('')
      }
      if (type === "word") {
        return string.split(' ').map(x => mask).join(' ')
      }
    }

    const filterResponses = this.test(string)
    if (!filterResponses.length) return string

    const censorResponses = filterResponses.map(x => {
      return { word: x.word, censor: censor(options.type, options.mask, x.word) }
    })

    return censorResponses.reduce((acc, cur) => {
      return acc.replace(new RegExp(`${cur.word}`, "gi"), cur.censor)
    }, string)
  }
}

module.exports = Filter