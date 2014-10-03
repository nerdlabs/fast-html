var camelCase = require('./camelCase');

function getAttributes(attrString) {
    if (!attrString) { return {}; }
    var reAttributes = /([^\s]*)=(["'])(.*?)\2|([\w\-]+)/g;
    var attrs = attrString.match(reAttributes);
    if (!attrs) { return {}; }
    return attrs.reduce(function (props, prop) {
        var data = prop.split('=');
        if (! data[1]) {
            return props;
        }
        data[1] = data[1].slice(1, -1);
        props[camelCase(data[0])] = data[1];
        return props;
    }, {});
}

module.exports = getAttributes;
