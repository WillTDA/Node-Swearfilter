const _ = require("lodash");
const Leetscript = require("leetscript");

const Leet = new Leetscript();

const DECODE_MAP = _.reduce(
  Leet.CHARMAP,
  (result, values, key) => {
    values.forEach((value) => {
      if (value.length === 1) {
        if (result[value]) {
          result[value].push(key);
        } else {
          result[value] = [key];
        }
      }
    });

    return result;
  },
  {}
);

function decode(encodedWord) {
    let results = [];
    let finalWord = encodedWord.split('');

    for(let i = 0; i<encodedWord.length; i++) {
        let letter = encodedWord[i];
        const decodeArray = DECODE_MAP[letter];
        // some normal characters have no translation
        if (decodeArray) {
          decodeArray.forEach(decodedLetter => {
            if (decodedLetter !== finalWord[i]) {
              finalWord[i] = decodedLetter;
              const newWord = finalWord.join("");
              results = results.concat(decode(newWord));
            }
          });
        }
    }

    return results.length > 0 ? results : [encodedWord];
}

module.exports = { decode };
