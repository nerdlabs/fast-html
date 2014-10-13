var pattern = new RegExp('<!--[^]*?(?=-->)-->|<(\/?)([a-z][a-z0-9]*)\\s*([^>]*?)(\/?)>', 'ig');

module.exports = pattern;
