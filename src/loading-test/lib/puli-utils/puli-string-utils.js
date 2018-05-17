PULI_UTILS = {};

/**
var l = getLocation("http://example.com/path");
console.debug(l.hostname)
>> "example.com"
console.debug(l.pathname)
>> "/path"
 * @param {type} _url
 * @returns {Element|PULI_UTILS.parse_url._a}
 */
PULI_UTILS.parse_url = function (_url) {
    var _a = document.createElement("a");
    _a.href = _url;
    return _a;
};

PULI_UTILS.parse_uri = function (_url) {
    var _a = this.parse_url(_url);
    var _uri = _a.pathname;
    if (typeof(_a.search) === "string") {
        _uri = _uri + _a.search;
    }
    if (typeof(_a.hash) === "string") {
        _uri = _uri + _a.hash;
    }
    return _uri;
};