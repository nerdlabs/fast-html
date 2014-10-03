var camelCase = function camelCase(str) {
    return str.replace(/-([a-z])/, function (_, letter) {
        return letter.toUpperCase();
    });
}

module.exports = camelCase;
