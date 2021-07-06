# Swear Filter

Detect Swear Words, and Handle Strings Containing Them. Smart Detection helps to Detect Words using Leetspeak, or any other Word Circumvention Methods.

Unlike other filters, this smart algorithm can solve the Scunthorpe Problem, meaning the user's content won't get flagged next time they say the word "grass". 😅

# Install Package

To Install this Powerful Word-Filtering Tool, open Your Project's Terminal and type:

`npm i swearfilter --save`

# Examples

Most of my NPM package users are Discord.js Bot Developers. For you guys, there's an example of how to use it in your bots!

```js
const Discord = require("discord.js");
const client = new Discord.Client();

const { Filter } = require("swearfilter");

const filter = new Filter({
    swearWords: ["bad", "words", "here"],
    smartDetect: true,
    useBaseFilter: false
});

client.on("message", async message => {
    if (filter.containsSwearWord(message.content)) {
        await message.delete();
        message.reply("https://youtu.be/un38j-pKLWE?t=358");
    }
});

client.login("Your Discord Bot Token")
```

For web devs who are just looking for a way to censor stuff on their sites, here's an example for you guys!

```js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const { Filter } = require("swearfilter");

const filter = new Filter({
    swearWords: ["bad", "words", "here"],
    smartDetect: true,
    useBaseFilter: false
});

app.get('/containsBadWord/:phrase', function (req, res) {
    if (filter.containsSwearWord(req.params.phrase)) {
        res.redirect("https://youtu.be/un38j-pKLWE?t=358")
    }
    else res.send("This phrase is clean!")
});

app.listen(port, function () {
    console.log(`App Listening at http://localhost:${port}`)
});
```

## Need Help, want to Uncensor a Word, or Find any Bugs? Heck, even considering contributing? Join Our Discord Server!

https://discord.gg/P2g24jp