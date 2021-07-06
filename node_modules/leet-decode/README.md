# leet-decode

npm module to convert a leet or 1337 string into a human-readable string.

Note that certain leet characters can be translated multiple ways, so this decode
utility will return all possible permutations of the original string.

## Install

```shell
npm install leet-decode
```

## Use

```javascript
const {decode} = require('leet-decode');

const result = decode('h3ll0');
// results -> ['hello']
```

## See Also

[leetscript](https://github.com/KevinGimbel/leetscript)

[@cityssm/unleet](https://github.com/cityssm/unleet)

## License

MIT
