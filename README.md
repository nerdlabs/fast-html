# FastHTML 
FastHTML is a single-purpose HTML parser focused on performance.


## Install

```shell
npm install --save https://github.com/nerdlabs/fastHTML.git
```

npm publish is on the way.

## Performance

Tests via [htmlparser-benchmark](https://github.com/AndreasMadsen/htmlparser-benchmark) are on the way.

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
* `Node` - `ElementNode` or `TextNode` to insert into 

### Example implementation

```js
console.log('Coming soon.');
```
