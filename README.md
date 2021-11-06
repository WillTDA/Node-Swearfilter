<h1 align="center">
🤬 Swear Filter 🤬
</h1>

Swear Filter is designed to detect swear words, and handle strings containing them.

## Features

- 🧠 <b>Smart Detection</b> | Detects words using leetspeak, or any other filter loopholes. It can also fix the Scunthorpe Problem, meaning the word "grass" won't get flagged.

- 💬 <b>Base Filter</b> | This package contains a base filter, and when activated, will attempt to detect over 2,000 swear words.

- 📝 <b>Very Customizable</b> | You can easily add or remove words from the filter.

- 📦 <b>Quick and Easy Setup</b> | Setting up a filter takes only a few seconds.

## Install Package

To install this powerful word-filtering tool, open your project's terminal and type:

`npm i swearfilter --save`

## Example Usage

```js
const { Filter } = require("swearfilter");
const filter = new Filter({
    swearWords: ["bad", "words", "here"], // Add your own custom words here.
    uncensoredWords: ["words", "to", "ignore"], // Specify words to ignore here.
    smartDetect: true, // Enable smart detection. (Defaults to true)
    useBaseFilter: false // Disable the base filter. (Defaults to false)
});

filter.containsSwearWord("b @ d");
// => true
```

## Contact Me

- 👋 Need Help? [Join Our Discord Server](https://discord.gg/P2g24jp)!

- 👾 Found a Bug or a Base Filter/Smart Detection Issue? [Open an Issue](https://github.com/WillTDA/Node-Swearfilter/issues), or Fork and [Submit a Pull Request](https://github.com/WillTDA/Node-Swearfilter/pulls) on our [GitHub Repository](https://github.com/WillTDA/Node-Swearfilter)!
