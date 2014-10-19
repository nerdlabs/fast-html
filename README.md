# fast-html [![Build Status][3]][4] [![Coverage Status][5]][6]
fast-html is a sax-style HTML parser focused on performance. It only copes with sane HTML - see the [Things that break](#things-that-break) section.


## Install

```shell
npm install --save fast-html
```

## Docs
[Test-documentation][7] generated with [mocha's][8] "doc" reporter.

## Usage

```
var fastHtml = require('fast-html')({ parseAttributes: true });

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

[3]: https://travis-ci.org/nerdlabs/fast-html.svg?branch=master
[4]: https://travis-ci.org/nerdlabs/fast-html
[5]: https://img.shields.io/coveralls/nerdlabs/fast-html.svg
[6]: https://coveralls.io/r/nerdlabs/fast-html
[7]: http://nerdlabs.github.io/fast-html/docs/
[8]: http://visionmedia.github.io/mocha/
