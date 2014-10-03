var parse = require('../').parse;


function TextNode(value) {
    this.rawText = value;
}

function HTMLElement(name, attributes) {
    this.tagName = name;
    this.attributes = attributes;
    this.childNodes = [];
    if (attributes.id) {
        this.id = attributes.id;
    }
}
HTMLElement.prototype.appendChild = function (node) {
    this.childNodes.push(node);
    return node;
};


function createElement(tagName, attributes) {
    return new HTMLElement(tagName, attributes);
}

function createTextNode(textContent) {
    return new TextNode(textContent);
}

var optimizationStatusMessages = [
    'undefined behaviour',
    'Function is optimized',
    'Function is not optimized',
    'Function is always optimized',
    'Function is never optimized',
    'Function is maybe deoptimized'
];

function getOptimizationStatus(fn) {
    var status = %GetOptimizationStatus(fn);
    return {
        status: status,
        message: optimizationStatusMessages[status]
    };
}

//Fill type-info
parse('<div></div>', createElement, createTextNode);

%OptimizeFunctionOnNextCall(parse);
//The next call
parse('<div></div>', createElement, createTextNode);

//Check
var status = getOptimizationStatus(parse);
console.log(status.message);

if (status.status !== 1 && status.status !== 3) {
    process.exit(1);
}
process.exit(0);
