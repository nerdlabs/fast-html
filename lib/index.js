var parseAttributes = require('parse-attributes'),
    pattern         = require('./pattern'),
    elements        = require('./elements');

/**
 * Parses HTML and returns a root element
 */
 var parse = function parse(data, createElementNode, createTextNode, parseAttrs) {

    if (data === undefined || !createElementNode || !createTextNode) {
        return;
    }

    if (parseAttrs === undefined) {
        parseAttrs = true;
    } else if (parseAttrs === false) {
        parseAttributes = function (attrString) {
            return attrString;
        };
    }

    var root          = createElementNode(null, parseAttrs ? {} : ''),
        currentParent = root,
        stack         = [root],
        lastTextPos   = -1,
        match         = null,
        text          = '';


    while (match = pattern.markup.exec(data)) {
        var tag                        = match[0],
            tagName                    = match[2],
            attributeString            = match[3],
            isClosingTag               = match[1] === '/',
            isExplicitlySelfClosingTag = match[4] === '/',
            isImplicitlySelfClosingTag = elements.selfClosing[match[2]],
            element                    = null;

        var isSelfClosingTag = isExplicitlySelfClosingTag || isImplicitlySelfClosingTag;

        if (lastTextPos > -1) {
            if (lastTextPos + tag.length < pattern.markup.lastIndex) {
                    // if has content
                    text = data.substring(lastTextPos, pattern.markup.lastIndex - tag.length);
                    currentParent.appendChild(createTextNode(text));
                }
            }

            lastTextPos = pattern.markup.lastIndex;

            if (tag.charAt(1) == '!') {
                // this is a comment
                continue;
            }

            if (!isClosingTag) {
                // not </ tags
                element = createElementNode(tagName, parseAttributes(attributeString));
                currentParent = currentParent.appendChild(element);
                stack.push(currentParent);

                if (tagName === 'script') {
                    // a little test to find next </script> or </style> ...
                    var closeMarkup = '</script>';
                    var index = data.indexOf(closeMarkup, pattern.markup.lastIndex);

                    text = data.substring(pattern.markup.lastIndex, index);
                    if (text.length > 0) {
                        currentParent.appendChild(createTextNode(text));
                    }
                    lastTextPos = pattern.markup.lastIndex = index + closeMarkup.length;
                    isClosingTag = true;
                }
            }

            if (isClosingTag || isSelfClosingTag) {
                // </ or /> or <br> etc.
                while (true) {
                    if (currentParent.tagName == tagName) {
                        stack.pop();
                        currentParent = stack[stack.length - 1];
                        break;
                    } else {
                        // Use aggressive strategy to handle unmatching markups.
                        break;
                    }
                }
            }
        }

        return root;
    }

module.exports = parse;
