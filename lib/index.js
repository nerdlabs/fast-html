var parseAttributes = require('parse-attributes');
var markup          = require('./pattern/markup');
var selfClosingTags = require('./elements/selfClosing');



function Parser(options) {
    this.listeners = {};
    this.options = options || {};
}

Parser.prototype.on = function on(event, listener) {
    if (!Array.isArray(this.listeners[event])) {
        // no listeners have been registered yet
        this.listeners[event] = [];
    }

    if (this.listeners[event].indexOf(listener) !== -1) {
        // early exit if listener already listens to specified event
        return this;
    }

    this.listeners[event].push(listener);

    return this;
};

Parser.prototype.off = function off(event, listener) {
    if (!Array.isArray(this.listeners[event])) {
        // early exit if listeners for this event don't exist
        return this;
    }

    if (!listener) {
        // no listener function has been specified, remove all events
        this.listeners[event] = [];
    }

    for (var i = 0, l = this.listeners[event].length; i < l; i += 1) {
        if (this.listeners[event][i] === listener) {
            this.listeners[event].splice(i, 1);
        }
    }

    return this;
};

Parser.prototype.emit = function emit(event) {
    var args = [];
    var i = 0;
    var l = 0;

    if (!Array.isArray(this.listeners[event])) {
        // early exit if no listeners are listening
        return this;
    }

    for (i = 0, l = arguments.length; i < l; i += 1) {
        // copy arguments (performance - leaky arguments)
        args[i] = arguments[i + 1];
    }

    for (i = 0, l = this.listeners[event].length; i < l; i += 1) {
        this.listeners[event][i].apply(this, args);
    }

    return this;
};

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
