var camelCase    = require('./camelCase');
var reAttributes = require('../pattern').attributes;

function getAttributes(attrString) {
    var attributes = {},
        match      = null,
        attrName   = '';
        attrValue  = null;

    if (!attrString) { return attributes; }

    while (match = reAttributes.exec(attrString)) {
        attrName = match[1] || match[5];
        if (!attrName) { continue; }
        if (attrName.indexOf('-') !== -1) { attrName = camelCase(attrName); }
        attrValue = match[3] || match[4] || true;
        attributes[attrName] = attrValue;
    }

    return attributes;
}

module.exports = getAttributes;
