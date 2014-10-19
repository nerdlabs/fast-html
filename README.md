# FastHTML [![Build Status][3]][4] [![Coverage Status][5]][6]
FastHTML is a sax-style HTML parser focused on performance. It only copes with sane HTML - see the [Things that break](#things-that-break) section.


## Install

```shell
npm install --save fasthtml
```

## Docs
[Test-documentation][7] generated with [mocha's][8] "doc" reporter.

## Usage

```
var fastHtml = require('fasthtml')({ parseAttributes: true });

// Receive start tags
fastHtml.on('start', function(tagName, attributes){

});

// Receive text nodes
fastHtml.on('data', function(text){

});

// Receive end tags
fastHtml.on('end', function(tagName)) {

});

// Release the hounds
fastHtml.parse('<ul id="list"><li>Hello World</li></ul>')

```

### Things that break
FastHTML is designed for maximum performance, therefore it will not

* Try to fix broken markup
* Try to fix slightly broken markup
* Try to do automagic closing stuff
* Be graceful about unescaped HTML strings in inline `script`, `style` and HTML attributes

#### Solutions
* `</script>` strings in inline `script` - Use `<![CDATA[...]]>`.
* HTML strings in attributes - Escape them.

[3]: https://travis-ci.org/nerdlabs/fastHTML.svg?branch=master
[4]: https://travis-ci.org/nerdlabs/fastHTML
[5]: https://img.shields.io/coveralls/nerdlabs/fastHTML.svg
[6]: https://coveralls.io/r/nerdlabs/fastHTML
[7]: http://nerdlabs.github.io/fastHTML/docs/
[8]: http://visionmedia.github.io/mocha/
