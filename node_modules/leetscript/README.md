# leetscript
> Convert text into 1337

`leetscript` is a node module to convert strings into [Leetspeak](https://en.wikipedia.org/wiki/Leet).

## Instal

```
$ npm install --save leetscript
```

## Usage

```js
const Leetscript = require('leetscript')
const Leet = new Leetscript()

const str = Leet.encode('lorem ipsum')

console.log(str) // => |_023|V| ][95[_]]V[
```

## Options

Leetscript can be initialized with `true`. This enabled simple-mode which does not use advanced character groups like `|_` for `l` or `|V|` for `m` but instead keeps some characters unchanged.

```js
const Leetscript = require('leetscript')
const LeetAdvanced = new Leetscript()
const LeedSimple = new Leetscript(true)

console.log(LeetAdvanced.encode('lorem ipsum')) // => |_023|V| ][95[_]]V[
console.log(LeetSimple.encode('lorem ipsum')) // => 1023m 1p5um
```

## API

### leetscript.encode(string)

Encodes the given string into Leetspeak.

Returns the encoded string if passed a string, false if passed `false`, `undefined`, or `null` or whatever was passed an is not a string (e.g. numbers, objects, arrays).

### leetscript.encodePromise(string)

Encodes the string using `leetscript.encode` but wraps the encoded string into a Promise. On error it returns the error message `Unable to convert string! Got: ' + str`. `str` holds whatever was passed as argument.
