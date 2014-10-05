var getAttributes = require('./utils/getAttributes'),
    pattern       = require('./pattern'),
    elements      = require('./elements');

/**
 * Parses HTML and returns a root element
 */
 var parse = function parse(data, createElementNode, createTextNode) {

    if (arguments.length !== 3) {
        return;
    }

    var root          = createElementNode(null, {}),
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
            isImplicitlySelfClosingTag = elements.selfClosing[match[2]];

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
                currentParent = currentParent.appendChild(createElementNode(tagName, getAttributes(attributeString)));
                stack.push(currentParent);
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
