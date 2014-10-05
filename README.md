# FastHTML [![Build Status][3]][4] [![Coverage Status][5]][6]
FastHTML is a single-purpose HTML parser focused on performance. It only copes with sane HTML - see the [Things that break](#things-that-break) section.
Based upon [node-fast-html-parser][0] by [ashi009][1]


## Install

```shell
npm install --save fasthtml
```

## Performance

Tests via [htmlparser-benchmark][2] are on the way.

## Docs
[Test-documentation][7] generated with [mocha's][8] "doc" reporter.

## Usage

```js
var parse = require('fasthtml');
var root = parse('<ul id="list"><li>Hello World</li></ul>', createElementNode, createTextNode);

```

## API

#### parse(HTMLString, elementNodeConstructor, textNodeConstructor)

* `HTMLString` - HTML `string` to parse
* `elementNodeConstructor` - `function` returning an `ElementNode`
* `textNodeConstructor` - `function` returning a `TextNode`

#### ElementNode(tagName, attributes)

* `tagName` - `string` tagName of the `ElementNode`
* `attributes` - `object` attribtues of the `ElementNode`

#### TextNode(textContent)
* `textString` - `string` contents of the `TextNode`


### Minimal implementation
See createElementNode.js and createTextNode.js in ./test/lib/

### Example implementation

```js
var HTMLElement = function HTMLElement(name, attributes) {
    this.tagName = name;
    this.attributes = attributes;
    this.childNodes = [];
    if (attributes.id) {
        this.id = attributes.id;
    }
};

HTMLElement.prototype.appendChild = function (node) {
    this.childNodes.push(node);
    return node;
};

var TextNode = function TextNode(value) {
    this.rawText = value;
}

function createElementNode(tagName, attributes) {
    return new HTMLElement(tagName, attributes);
}

function createTextNode(textContent) {
    return new TextNode(textContent);
}

var parse = require('fasthtml');
var parsed = parse('<ul id="list"><li>Hello World</li></ul>', createElementNode, createTextNode);
console.log(parsed);
```

### Things that break
FastHTML is designed for maximum performance, therefore it will not

* Try to fix broken markup
* Try to fix slightly broken markup
* Try to do automagic closing stuff
* Be graceful about unescaped HTML strings in inline `script`, `style` and HTML attributes

#### Solutions
##### `</script>` strings in inline `script`

Use `<![CDATA[...]]>`.

##### HTML strings in attributes

Escape them.


[0]: https://github.com/ashi009/node-fast-html-parser
[1]: https://github.com/ashi009
[2]: https://github.com/AndreasMadsen/htmlparser-benchmark
[3]: https://travis-ci.org/nerdlabs/fastHTML.svg?branch=master
[4]: https://travis-ci.org/nerdlabs/fastHTML
[5]: https://img.shields.io/coveralls/nerdlabs/fastHTML.svg
[6]: https://coveralls.io/r/nerdlabs/fastHTML
[7]: http://nerdlabs.github.io/fastHTML/docs/
[8]: http://visionmedia.github.io/mocha/
