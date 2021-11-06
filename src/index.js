const { unleet } = require("@cityssm/unleet");
const { filterWords } = require("./functions/filter");

/**
 * Swear Filter Options
 * @typedef {object} filterOptions
 * @prop {string[]} [swearWords=[]] The Words to Use in the Filter.
 * @prop {string[]} [uncensoredWords=[]] The Words to Ignore if Picked Up by the Filter.
 * @prop {boolean} [smartDetect=true] Whether you want the system to Detect Leetspeak, and any other methods of Filter Circumvention. Also ignores False Positives / fixes the Scunthorpe Problem unlike other filters.
 * @prop {boolean} [useBaseFilter=false] Whether you want the system to use a Base Filter with over 2,000 Words. Not Recommended as it may still need tuning.
 *
 */
const filterOptions = {
    swearWords: [],
    uncensoredWords: [],
    smartDetect: true,
    useBaseFilter: false
}

class Filter {
    /**
    * @param {filterOptions} options
    * @example
    * const { Filter } = require("swearfilter"); 
    * 
    * const filter = new Filter({
    *     swearWords: ["bad", "words", "here"],
    *     uncensoredWords: ["words", "to", "ignore"],
    *     smartDetect: true,
    *     useBaseFilter: false
    * });
    */
    constructor(options = {}) {
        /**
        * Swear Filter Options
        * @type {filterOptions}
        */

        options.swearWords = options.swearWords || [];
        options.uncensoredWords = options.uncensoredWords || [];
        options.smartDetect = options.smartDetect || true;
        options.useBaseFilter = options.useBaseFilter || false;

        this.options = options;
        Object.assign(this.options, options);
    }
    /**
    * @param {string} string The String to Test for Bad Words.
    * @returns {boolean} Whether the String Contains Bad Words.
    * @example
    * const { Filter } = require("swearfilter"); 
    * 
    * const filter = new Filter({
    *     swearWords: ["bad", "words", "here"],
    *     uncensoredWords: ["words", "to", "ignore"],
    *     smartDetect: true,
    *     useBaseFilter: false
    * });
    * 
    * if (filter.containsSwearWord("b @ d")) {
    *     console.log("A bad word was said!")
    * }
    */
    containsSwearWord(string) {
        if (!string) return console.log("Swear Filter Error: String was not Provided. Need Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");
        if (typeof string !== "string") return console.log("Swear Filter Error: The Parameter Provided was not of type 'string'. Need Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");

        let words, value;
        let leetConfig = require("./config/leetAlphabetConfig.json");
        if (this.options.useBaseFilter) { //If useBaseFilter is selected, add the words to the base filter
            words = require("./config/baseFilter.json");
            words = words.concat(this.options.swearWords);
        } else { //Else, just use the words as the custom ones
            words = this.options.swearWords;
        }

        //remove any uncensored words from the words array
        words = words.filter(word => !this.options.uncensoredWords.includes(word));

        if (this.options.smartDetect) {
            let decodedStrings = unleet(string);
            for (let i = 0; i < decodedStrings.length; i++) {
                let foundWords = filterWords({
                    wordsToFilter: words,
                    stringToCheck: decodedStrings[i],
                    lengthThreshold: 3,
                    leetAlphabet1: leetConfig[0],
                    leetAlphabet2: leetConfig[1],
                    shortWordLength: 2,
                    shortWordExceptions: []
                });
                if (foundWords.length >= 1) {
                    value = true;
                    return value;
                }
                else {
                    value = false;
                    if (i === decodedStrings.length - 1) return value;
                }
            }
        } else {
            if (words.some(word => string.includes(word))) {
                value = true;
                return value;
            } else {
                value = false;
                return value;
            }
        }
    }
}

module.exports.Filter = Filter