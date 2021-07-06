'use strict';
// Array random helper
const _arrayRandom = (arr, maxOffset, minOffset) => {
  let max = maxOffset || arr.length
 	let min = minOffset || 0
	let random = Math.floor( (Math.random() * (max - min)) + min );
  return arr[random];
}

class l3375c21p7 {
  constructor(simple = false) {
    this.simple = simple
    this.CHARMAP = {
      "a": ["4", "@", "/\\", "^", "α", "λ"],
      "b": ["8", "|3", "ß", "13"],
      "c": ["c", "(", "[", "<"],
      "d": ["d", "|)", "|]"],
      "e": ["3"],
      "f": ["f", "|="],
      "g": ["6", "9"],
      "h": ["h", "4", "|-|","]-[", "/-/", ")-("],
      "i": ["i", "!", "1", "|", "]["],
      "j": ["j", "_|"],
      "k": ["k", "|<", "|{"],
      "l": ["1", "|_"],
      "m": ["m", "/\\/\\", "/v\\", "|V|", "]V["],
      "n": ["n", "|\\|", "/\\/", "/V", "|V", "/\\\\/"],
      "o": ["0", "()", "[]"],
      "p": ["p", "9", "|°", "|>"],
      "q": ["q", "0_", "0,"],
      "r": ["2", "|2", "12"],
      "s": ["5", "$", "§"],
      "t": ["7", "+", "†"],
      "u": ["u", "|_|", "[_]"],
      "v": ["v", "\\/", "|/", "\\|"],
      "w": ["w","\\/\\/" , "VV" , "\\A/" , "\\\\'" , "uu" , "\\^/" , "\\|/"],
      "x": ["x", "><", ")(", "}{"],
      "y": ["y","`/" , "°/"],
      "z": ["2", "\"/_"]
    }
  }

  encode (str) {
	if(!str) {
		return false
	}
  // Return everything that is not a string
  if(typeof str !== 'string') {
    return str;
  }
  // Defines a new empty string
  let encString = '';
  // Goes through every character in the string
  str.split('').forEach( letter => {
    let key = letter.toLowerCase()
    let hasLetter = this.CHARMAP[key]
    if(hasLetter) {
      if(this.simple) {
        letter = this.CHARMAP[key][0]
      } else {
        // Get a random letter in LEET
        letter = _arrayRandom(this.CHARMAP[key])
      }
    }
    // Add it to the string
    encString += letter
  });

  return encString
  }

	encodePromise (str) {
    return new Promise( (resolve, reject) => {
      let new_str = this.encode(str);
      if(new_str) {
        resolve(new_str)
      } else {
        reject('Unable to convert string! Got: ' + str)
      }
    })
  }

}

module.exports = l3375c21p7
