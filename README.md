# FastHTML [![Build Status][3]][4]
FastHTML is a single-purpose HTML parser focused on performance.
Based upon [node-fast-html-parser][0] by [ashi009][1]


## Install

```shell
npm install --save https://github.com/nerdlabs/fastHTML.git
```

npm publish is on the way.

## Performance

Tests via [htmlparser-benchmark][2] are on the way.

## Usage

```js
var parser = require('fasthtml');
var root = HTMLParser.parse('<ul id="list"><li>Hello World</li></ul>');

```

## API

#### parse(HTMLString, elementNodeConstructor, textNodeConstructor)

* `HTMLString` - HTML `string` to parse
* `elementNodeConstructor` - `function` returning an `ElementNode`
* `textNodeConstructor` - `function` returning a `TextNode`

#### elementNodeFactory(tagName, attributes)

* `tagName` - `string` tagName of the `ElementNode`
* `attributes` - `object` attribtues of the `ElementNode`

#### textNodeFactory(textContent)
* `textString` - `string` contents of the `TextNode`


### Minimal implementation

#### ElementNode
#### appendChild(Node)
* `Node` - `ElementNode` or `TextNode` to append

### Example implementation

```js
console.log('Coming soon.');
```

[0]: https://github.com/ashi009/node-fast-html-parser
[1]: https://github.com/ashi009
[2]: https://github.com/AndreasMadsen/htmlparser-benchmark
[3]: https://travis-ci.org/nerdlabs/fastHTML.svg?branch=master
[4]: https://travis-ci.org/nerdlabs/fastHTML
