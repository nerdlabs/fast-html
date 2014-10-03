var HTMLElement = function HTMLElement(name, attributes) {
    this.tagName = name;
    this.attributes = attributes;
    this.childNodes = [];
    if (attributes.id) {
        this.id = attributes.id;
    }
};

HTMLElement.prototype.appendChild = function (node) {
    this.childNodes.push(node);
    return node;
};

module.exports = HTMLElement;
