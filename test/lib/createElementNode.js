var HTMLElement = require('./HTMLElement');

function createElement(tagName, attributes) {
    return new HTMLElement(tagName, attributes);
}

module.exports = createElement;
