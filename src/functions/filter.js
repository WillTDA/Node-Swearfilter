// Join items in an array if they have X length or less and if the next or previous item in the array also has the same length.
// Ex. suppose lengthThreshold is 3, ['mo', 'ro', 'n'] would return 'moron'.
const concatenate = (array, lengthThreshold) => {
  const l = lengthThreshold;
  const itemsToJoin = [];

  array.forEach((item, index, array) => {
    if (
      item.length <= l &&
      ((array[index + 1] && array[index + 1].length <= l) ||
        (array[index - 1] && array[index - 1].length <= l))
    ) {
      itemsToJoin.push(item);
    }
  });

  const joinedItem = itemsToJoin.join('');
  return joinedItem;
};

// Translate text to leet
const textToLeet = (alphabet, str, toLowerCase) => {
  // 1) Create an array containing all letters of the string in uppercase.
  // ex. 'dog' ---> ['D', 'O', 'G']
  const arr = str.toUpperCase().split('');

  // 2) For each letter in arr, assign alphabet's value of that letter.
  // ex. ['D', 'O', 'G'] ---> ['D', '0', '6']
  for (let i in arr) {
    arr[i] = alphabet[arr[i]];
  }

  // 3) Return arr joined as a single string, ex. ['D', '0', '6'] ---> 'D06' and lowercase it depending on
  // the value of toLowercase (it must be a boolean).
  return toLowerCase === true ? arr.join('').toLowerCase() : arr.join('');
};

// Translate leet to text
const leetToText = (alphabet, str, toLowerCase) => {
  // 1) Create an array with all letters of the string
  const arr = str.toUpperCase().split('');
  const alphabetKeys = Object.keys(alphabet);

  for (let i in arr) {
    // 2) If the letter of the current iteration is not included in the alphabet keys,
    // but but happens to be the symbol that corresponds to that letter in the alphabet,
    // add its letter. Ex. ('ANIM@L' will become 'ANIMAL')
    if (!alphabetKeys.includes(arr[i])) {
      arr[i] = alphabetKeys[Object.values(alphabet).indexOf(arr[i])];
    }
  }

  // 3) Return the array as a single string and lowercase it depending on
  // the value of toLowercase (it must be a boolean).
  return toLowerCase === true ? arr.join('').toLowerCase() : arr.join('');
};

// Check if a word is present in a string in its many variations.
const filterWords = (configObj) => {
  const {
    wordsToFilter,
    stringToCheck,
    lengthThreshold,
    leetAlphabet1,
    leetAlphabet2,
    shortWordLength,
    shortWordExceptions
  } = configObj;

  // 1) Create an array with all the words. The regex below removes all whitespace, including line breaks.
  const stringLowercase = stringToCheck.toLowerCase();
  let wordsInArray = stringLowercase.trim().split(/\s+/g);

  // 2) Remove non alphanumeric chars from the words (ex. 'idiot.' would become 'idiot')
  let wordsInArrayNoSigns = wordsInArray.map((word) =>
    word.replace(/[^a-zA-Z\d\s:]/g, '')
  );

  // 3) Same as above but removing numbers as well
  wordsInArrayOnlyLetters = wordsInArray.map((word) =>
    word.replace(/[^a-zA-Z]/g, '')
  );

  // 4) If there are words separated by spaces (ex. 'i', 'd', 'i', 'o', 't'), join them.
  const concatenatedWords = concatenate(wordsInArrayNoSigns, lengthThreshold);

  // 5) Replace consecutive duplicated characters in the string (ex. 'iidiot') and create an array with its result.
  // wordsInArrayNoConsDup will help us find words that become short when removing their duplicated letter, for
  // instance 'liib' ---> 'lib'
  const stringNoConsecutiveDuplicate = stringToCheck.replace(/(.)\1+/g, '$1');
  const wordsInArrayNoConsDup = stringNoConsecutiveDuplicate
    .toLowerCase()
    .trim()
    .split(/\s+/g);

  // 6) Translate the possible leet in each individual word whose duplicated consecutive characters have NOT been removed.
  // Ex. 'dumba$$' ---> 'dumbass'.
  const individualWordsLeeted1 = wordsInArray.map((word) =>
    leetToText(leetAlphabet1, word, true)
  );

  const individualWordsLeeted2 = wordsInArray.map((word) =>
    leetToText(leetAlphabet2, word, true)
  );

  // 7) Translate the possible leet in each individual word whose duplicated consecutive characters have been removed.
  // Ex. 'l11b' ---> 'lib'.
  const individualWordsNoConsDupLeeted1 = wordsInArrayNoConsDup.map((word) =>
    leetToText(leetAlphabet1, word, true)
  );

  const individualWordsNoConsDupLeeted2 = wordsInArrayNoConsDup.map((word) =>
    leetToText(leetAlphabet2, word, true)
  );

  // 8) Translate the whole sentence with no consecutive dups to check if there's leet in it (ex. '1diot');
  const translatedLeet1 = leetToText(
    leetAlphabet1,
    stringNoConsecutiveDuplicate,
    true
  );

  const translatedLeet2 = leetToText(
    leetAlphabet2,
    stringNoConsecutiveDuplicate,
    true
  );

  // 9) Check for any occurence - Note how strings and arrays have their own indexOf method.
  // Also, individualWordsLeeted1 and 2 are repeated in both the if and else if statement.
  // That's because we need to check for leet in both versions of the string: with consecutive
  // duplicates and without them in and this applies to long and short words as well.
  
  // The system will also attempt to detect and filter out any false positives, also known as the Clbuttic Problem.
  let foundWords = [];
  for (let i = 0; i != wordsToFilter.length; i++) {
    const word = wordsToFilter[i];

    // Check for long words in the string with only letters
    wordsInArrayOnlyLetters.forEach((wordOnlyLetters) => {
      if (!foundWords.includes(word)) {
        if (
          wordsToFilter.includes(wordOnlyLetters) &&
          word.length > shortWordLength &&
          !shortWordExceptions.includes(word) &&
          wordOnlyLetters.indexOf(word) != -1
        ) {
          foundWords.push(word);
        }
      }
    });

    // Check for the words in all the other types of string
    if (
      !foundWords.includes(word) &&
      word.length > shortWordLength &&
      !shortWordExceptions.includes(word) &&
      ((wordsInArrayNoSigns.indexOf(word) != -1 && wordsInArrayNoSigns.some(word => wordsToFilter.includes(word))) ||
        (stringLowercase.indexOf(word) != -1 && wordsToFilter.includes(stringLowercase)) ||
        (concatenatedWords.indexOf(word) != -1 && wordsToFilter.includes(concatenatedWords)) ||
        (translatedLeet1.indexOf(word) != -1 && wordsToFilter.includes(translatedLeet1)) ||
        (translatedLeet2.indexOf(word) != -1 && wordsToFilter.includes(translatedLeet2)) ||
        (stringNoConsecutiveDuplicate.indexOf(word) != -1 && stringNoConsecutiveDuplicate.some(word => wordsToFilter.includes(word))) ||
        (individualWordsLeeted1.includes(word) === true && individualWordsLeeted1.some(word => wordsToFilter.includes(word))) ||
        (individualWordsLeeted2.includes(word) === true && individualWordsLeeted2.some(word => wordsToFilter.includes(word))))

    ) {
      foundWords.push(word);
    } else if (
      !foundWords.includes(word) &&
      (word.length <= shortWordLength || shortWordExceptions.includes(word)) &&
      (wordsInArrayNoSigns.includes(word) === true ||
        wordsInArrayNoConsDup.includes(word) === true ||
        individualWordsNoConsDupLeeted1.includes(word) === true ||
        individualWordsNoConsDupLeeted2.includes(word) === true ||
        individualWordsLeeted1.includes(word) === true ||
        individualWordsLeeted2.includes(word) === true)
    ) {
      foundWords.push(word);
    }
  }
  return foundWords;
};

module.exports = {
  filterWords
};
