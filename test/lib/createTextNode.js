var TextNode = require('./TextNode');

function createTextNode(textContent) {
    return new TextNode(textContent);
}

module.exports = createTextNode;
