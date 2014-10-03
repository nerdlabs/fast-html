var getAttributes = require('./utils/getAttributes');
var pattern = require('./pattern');
var elements = require('./elements');

/**
 * Parses HTML and returns a root element
 */
module.exports = {
    /**
     * Parse a chuck of HTML source.
     * @param  {string} data      html
     * @return {HTMLElement}      root element
     */
    parse: function(data, createElementNode, createTextNode) {

        if (arguments.length !== 3) {
            return;
        }

        var root = createElementNode(null, {});
        var currentParent = root;
        var stack = [root];
        var lastTextPos = -1;

        for (var match, text; match = pattern.markup.exec(data); ) {
            if (lastTextPos > -1) {
                if (lastTextPos + match[0].length < pattern.markup.lastIndex) {
                    // if has content
                    text = data.substring(lastTextPos, pattern.markup.lastIndex - match[0].length);
                    currentParent.appendChild(createTextNode(text));
                }
            }

            lastTextPos = pattern.markup.lastIndex;

            if (match[0][1] == '!') {
                // this is a comment
                continue;
            }

            if (!match[1]) {
                // not </ tags

                if (!match[4] && elements.closedByOpening[currentParent.tagName]) {
                    if (elements.closedByOpening[currentParent.tagName][match[2]]) {
                        stack.pop();
                        currentParent = stack[stack.length - 1];
                    }
                }

                currentParent = currentParent.appendChild(createElementNode(match[2], getAttributes(match[3])));
                stack.push(currentParent);

                if (elements.blockText[match[2]]) {
                    // a little test to find next </script> or </style> ...
                    var closeMarkup = '</' + match[2] + '>';
                    var index = data.indexOf(closeMarkup, pattern.markup.lastIndex);

                    if (match[2] === 'script' || match[2] === 'pre' || match[2] === 'style') {
                        if (index == -1) {
                            // there is no matching ending for the text element.
                            text = data.substr(pattern.markup.lastIndex);
                        } else {
                            text = data.substring(pattern.markup.lastIndex, index);
                        }
                        if (text.length > 0)
                            currentParent.appendChild(createTextNode(text));
                    }

                    if (index == -1) {
                        lastTextPos = pattern.markup.lastIndex = data.length + 1;
                    } else {
                        lastTextPos = pattern.markup.lastIndex = index + closeMarkup.length;
                        match[1] = true;
                    }
                }
            }

            if (match[1] || match[4] ||
                    elements.selfClosing[match[2]]) {
                // </ or /> or <br> etc.
                while (true) {
                    if (currentParent.tagName == match[2]) {
                        stack.pop();
                        currentParent = stack[stack.length - 1];
                        break;
                    } else {
                        // Trying to close current tag, and move on
                        if (elements.closedByClosing[currentParent.tagName]) {
                            if (elements.closedByClosing[currentParent.tagName][match[2]]) {
                                stack.pop();
                                currentParent = stack[stack.length - 1];
                                continue;
                            }
                        }
                        // Use aggressive strategy to handle unmatching markups.
                        break;
                    }
                }
            }
        }

        return root;
    }
};
