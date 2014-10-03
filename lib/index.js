function camelCase(str) {
    return str.replace(/-([a-z])/, function (_, letter) {
        return letter.toUpperCase();
    });
}

function getAttributes(attrString) {
    if (!attrString) { return {}; }
    var reAttributes = /([^\s]*)=(["'])(.*?)\2|([\w\-]+)/g;
    var attrs = attrString.match(reAttributes);
    if (!attrs) { return {}; }
    return attrs.reduce(function (props, prop) {
        var data = prop.split('=');
        data[1] = data[1].slice(1, -1);
        props[camelCase(data[0])] = data[1];
        return props;
    }, {});
}


var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][a-z0-9]*)\s*([^>]*?)(\/?)>/ig;
var kSelfClosingElements = {
    meta: true,
    img: true,
    link: true,
    input: true,
    area: true,
    br: true,
    hr: true
};
var kElementsClosedByOpening = {
    li: {li: true},
    p: {p: true, div: true},
    td: {td: true, th: true},
    th: {td: true, th: true}
};
var kElementsClosedByClosing = {
    li: {ul: true, ol: true},
    p: {div: true},
    td: {tr: true, table: true},
    th: {tr: true, table: true}
};
var kBlockTextElements = {
    script: true,
    noscript: true,
    style: true,
    pre: true
};

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

        var root = createElementNode(null, {});
        var currentParent = root;
        var stack = [root];
        var lastTextPos = -1;

        for (var match, text; match = kMarkupPattern.exec(data); ) {
            if (lastTextPos > -1) {
                if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
                    // if has content
                    text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
                    currentParent.appendChild(createTextNode(text));
                }
            }

            lastTextPos = kMarkupPattern.lastIndex;

            if (match[0][1] == '!') {
                // this is a comment
                continue;
            }

            if (!match[1]) {
                // not </ tags

                if (!match[4] && kElementsClosedByOpening[currentParent.tagName]) {
                    if (kElementsClosedByOpening[currentParent.tagName][match[2]]) {
                        stack.pop();
                        currentParent = stack[stack.length - 1];
                    }
                }

                currentParent = currentParent.appendChild(createElementNode(match[2], getAttributes(match[3])));
                stack.push(currentParent);

                if (kBlockTextElements[match[2]]) {
                    // a little test to find next </script> or </style> ...
                    var closeMarkup = '</' + match[2] + '>';
                    var index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);

                    if (match[2] === 'script' || match[2] === 'pre' || match[2] === 'style') {
                        if (index == -1) {
                            // there is no matching ending for the text element.
                            text = data.substr(kMarkupPattern.lastIndex);
                        } else {
                            text = data.substring(kMarkupPattern.lastIndex, index);
                        }
                        if (text.length > 0)
                            currentParent.appendChild(createTextNode(text));
                    }

                    if (index == -1) {
                        lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
                    } else {
                        lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
                        match[1] = true;
                    }
                }
            }

            if (match[1] || match[4] ||
                    kSelfClosingElements[match[2]]) {
                // </ or /> or <br> etc.
                while (true) {
                    if (currentParent.tagName == match[2]) {
                        stack.pop();
                        currentParent = stack[stack.length - 1];
                        break;
                    } else {
                        // Trying to close current tag, and move on
                        if (kElementsClosedByClosing[currentParent.tagName]) {
                            if (kElementsClosedByClosing[currentParent.tagName][match[2]]) {
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
