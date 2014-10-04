var camelCase    = require('./camelCase');
var reAttributes = require('../pattern').attributes;

function getAttributes(attrString) {
    var attributes = {},
        match      = null,
        attrName   = '';

    if (!attrString) { return attributes; }

    while (match = reAttributes.exec(attrString)) {
        if (!match[1]) { continue; }
        attrName = match[1];
        if (match[1].indexOf('-') !== -1) { attrName = camelCase(match[1]); }
        attributes[attrName] = match[3];
    }

    return attributes;
}

module.exports = getAttributes;
