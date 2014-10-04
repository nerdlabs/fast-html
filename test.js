var fs = require('fs');
var util = require('util');
var parse = require('./').parse;

var content = fs.readFileSync('./test.html').toString('utf8');

var createTextNode = require('./test/lib/createTextNode');
var createElementNode = require('./test/lib/createElementNode');


var tree = parse(content, createElementNode, createTextNode);

console.log(util.inspect(tree, { colors: true, depth: 16 }));
