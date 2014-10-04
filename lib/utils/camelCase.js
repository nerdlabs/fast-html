var camelCase = function camelCase(str) {
    return str.replace(/-([a-z])/g, function (_, letter) {
        return letter.toUpperCase();
    });
}

module.exports = camelCase;
