<h1 align="center">
🤬 Swear Filter 🤬
</h1>

Swear Filter is designed to detect swear words, and handle strings containing them.

[![NPM](https://nodei.co/npm/swearfilter.png)](https://npmjs.com/package/swearfilter)

[![Downloads](https://img.shields.io/npm/dt/swearfilter?logo=npm&style=flat-square)](https://npmjs.com/package/swearfilter) [![Discord Server](https://img.shields.io/discord/667479986214666272?logo=discord&logoColor=white&style=flat-square)](https://discord.gg/P2g24jp)

## Features

- 🧠 <b>Smart Detection</b> | Detects words using leetspeak, or any other filter loopholes. It can also fix the Scunthorpe Problem, meaning words like "grass" won't get flagged.

- 💬 <b>Base Filter</b> | This package contains a base filter, and when chosen to be activated, will allow you to detect approximately 2,000 swear words.

- 📝 <b>Very Customizable</b> | You can easily add or remove words from the filter.

- 📦 <b>Quick and Easy Setup</b> | Setting up a filter takes only a few seconds.

- 🚫 <b>No Dependencies</b> | This package does not rely on any other packages to provide its functionality, making installation fast and the package size small.

## Install Package

To install this powerful word-filtering tool, open your project's terminal and type:

`npm i swearfilter --save`

## Creating a Filter

Creating a new filter is really quick and easy. Simply create a new instance of the `Filter` class!

```js
const Filter = require("swearfilter");

const filter = new Filter({
    swearWords: ["bad", "words", "here"], // Add your own custom words here.
    smartDetect: true, // Enable smart detection. (Defaults to true)
    baseFilter: {
        useBaseFilter: true, // Disable the base filter. (Defaults to false)
        uncensoredWords: ["words", "to", "ignore"] // Specify words to ignore here.
   }
});
```

## Filter Methods

- **`Filter#test(string)`**

    The `test()` method will test a string to see if it contains any bad words.
    
    Any bad words that were found will be returned in an array of `FilterResponse` objects, which also contain the type of filter that picked them up.

    ```js
    const Filter = require("swearfilter");

    const filter = new Filter({
        swearWords: ["bad", "words", "here"],
        smartDetect: true,
        baseFilter: {
            useBaseFilter: true,
            uncensoredWords: ["words", "to", "ignore"]
       }
    });

    filter.test("thisisbad");
    // => [ { word: 'bad', filter: 'custom' } ]

    filter.test("b @ d");
    // => [ { word: 'bad', filter: 'custom' } ]

    filter.test("b;a,..;a;.,;,d;,a.;,d;,B,;a,;D;;;g;h:f;;;d,;d");
    // => [ { word: 'bad', filter: 'custom' } ]
    ```
    <br>
- **`Filter#censor(string, options)`**

    The `censor()` method will replace any bad words found in a string with masks.

    You can specify the string to use when masking a bad word, and the type of masking to use.

    ```js
    const Filter = require("swearfilter");

    const filter = new Filter({
        swearWords: ["frick", "beach", "bad"],
        smartDetect: true,
        baseFilter: {
            useBaseFilter: true,
            uncensoredWords: ["words", "to", "ignore"]
       }
    });

    filter.censor("Hey, frick you beach, you are bad", { mask: "*", type: "character" }); // Censors all characters in bad words with "*".
    // => "Hey, ***** you *****, you are ***"

    filter.censor("Hey, frick you beach, you are bad", { mask: "[bleep]", type: "word" }); // Censors all words in bad words with "[bleep]".
    // => "Hey, [bleep] you [bleep], you are [bleep]"
    ```


## Contact Us

- 👋 Need Help? [Join Our Discord Server](https://discord.gg/P2g24jp)!

- 👾 Found a Bug or a Base Filter/Smart Detection Issue? [Open an Issue](https://github.com/WillTDA/Node-Swearfilter/issues), or Fork and [Submit a Pull Request](https://github.com/WillTDA/Node-Swearfilter/pulls) on our [GitHub Repository](https://github.com/WillTDA/Node-Swearfilter)!
