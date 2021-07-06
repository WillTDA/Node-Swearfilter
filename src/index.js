const { decode } = require("leet-decode");
const { filterWords } = require("./functions/filter");

/**
 * Swear Filter Options
 * @typedef {object} filterOptions
 * @prop {string[]} [swearWords=[]] The Words to Use in the Filter.
 * @prop {boolean} [smartDetect=true] Whether you want the system to Detect Leetspeak, and any other methods of Filter Circumvention. Also ignores False Positives / solves the Scunthorpe Problem unlike other filters.
 * @prop {boolean} [useBaseFilter=false] Whether you want the system to use a Base Filter with Over 2,000 Words. Not Recommended as it may still need tuning.
 *
 */
const filterOptions = {
    swearWords: [],
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
    *     smartDetect: true,
    *     useBaseFilter: false
    * });
       */
    constructor(options = {}) {
        /**
     * Swear Filter Options
     * @type {filterOptions}
     */
        this.options = options;
        Object.assign(this.options, options);
    }
    /**
* @param {Discord.Message} message The Message Sent by the User.
* @returns Boolean
* @example
* const { Filter } = require("swearfilter"); 
* 
* const filter = new Filter({
* swearWords: ["bad", "words", "here"],
* smartDetect: true,
* useBaseFilter: false
* });
* 
* if (filter.containsSwearWord("b @ d")) {
*     await message.delete();
*     message.channel.send("Hey, don't send that here!");
* }
*/
    containsSwearWord(message) {
        if (!message) return console.log("Swear Filter Error: Message was not Provided. Need Help? Join Our Discord Server at 'https://discord.gg/P2g24jp'");

        let words, value;
        let leetConfig = require("./config/leetAlphabetConfig.json").configs
        if (this.options.useBaseFilter) { //If useBaseFilter is selected, add the words to the base filter
            words = require("./config/baseFilter.json").words;
            this.options.swearWords.forEach(word => {
                words.push(word);
            });
        } else { //Else, just use the words as the custom ones
            words = this.options.swearWords;
        }

        if (this.options.smartDetect) {
            let decodedStrings = decode(message.content);
            for (let i = 0; i < decodedStrings.length; i++) {
                const configObj = {
                    wordsToFilter: words,
                    stringToCheck: decodedStrings[i],
                    lengthThreshold: 3,
                    leetAlphabet1: leetConfig[0],
                    leetAlphabet2: leetConfig[1],
                    shortWordLength: 2,
                    shortWordExceptions: []
                };
                let foundWords = filterWords(configObj);
                if (foundWords.length >= 1) {
                    value = true;
                    return value;
                }
                else {
                    value = false;
                    return value;
                }
            }
        } else {
            if (words.some(word => message.content.includes(word))) {
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