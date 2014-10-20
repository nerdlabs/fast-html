var parseAttributes = require('parse-attributes');
var markup          = require('./pattern/markup');
var selfClosingTags = require('./elements/selfClosing');
var EventEmitter    = require('./events').EventEmitter;



function Parser(options) {
    this.options = options || {};
}

Parser.prototype = new EventEmitter();
Parser.prototype.constructor = Parser;


Parser.prototype.parse = function parse(data) {
    var stack         = [],
        lastTextPos   = -1,
        match         = null,
        text          = '';


    while ((match = markup.exec(data)) !== null) {
        var tag                        = match[0],
            tagName                    = match[2],
            attributeString            = match[3],
            attributes                 = null,
            closing                    = match[1] === '/',
            explicitlySelfClosing      = match[4] === '/',
            implicitlySelfClosing      = selfClosingTags[match[2]],
            selfClosing                = false,
            closeMarkup                = '',
            index                      = -1;

        selfClosing = explicitlySelfClosing || implicitlySelfClosing;

        if (lastTextPos > -1 && lastTextPos + tag.length < markup.lastIndex) {
            // if has content
            text = data.substring(lastTextPos, markup.lastIndex - tag.length);
            this.emit('data', text);
        }

        lastTextPos = markup.lastIndex;

        if (tag.charAt(1) === '!') {
            // this is a comment
            continue;
        }

        if (!closing) {
            // not </ tags

            stack.push(tagName);
            if (this.options.parseAttributes) {
                attributes = parseAttributes(attributeString);
            }

            this.emit('start', tagName, attributes || attributeString);

            if (tagName === 'script') {
                // a little test to find next </script> or </style> ...
                closeMarkup = '</script>';
                index = data.indexOf(closeMarkup, markup.lastIndex);

                text = data.substring(markup.lastIndex, index);
                if (text.length > 0) {
                    this.emit('data', text);
                }
                lastTextPos = markup.lastIndex = index + closeMarkup.length;
                closing = true;
            }
        }

        if (closing || selfClosing) {
            // </ or /> or <br> etc.
            while (true) {
                if (stack[stack.length - 1] === tagName) {
                    stack.pop();

                    if (!selfClosing) {
                        this.emit('end', tagName);
                    }
                    break;
                } else {
                    // Use aggressive strategy to handle unmatching markups.
                    break;
                }
            }
        }
    }
};


module.exports = function parserFactory(options) {
    return new Parser(options);
};
