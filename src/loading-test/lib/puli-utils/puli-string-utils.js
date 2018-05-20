if (typeof(PULI_UTILS) === "undefined") {
    PULI_UTILS = {};
}

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

PULI_UTILS.is_json = function (_json_string, _strict) {
    if (typeof(_json_string) !== "string") {
        return false;
    }
    _json_string = _json_string.trim();
    if (_json_string.substr(0,1) !== "{" || _json_string.substr(_json_string.length-1,1) !== "}") {
        return false;
    }
    
    _strict = (typeof(_strict) === "undefined") ? true : false;
    
    
    try {
        if (_strict === true) {
            var _json = JSON.parse(_json_string);
        }
        else {
            eval("var _json = " + _json_string);
        }
        
        if (typeof(_json) === "object" && _json !== null) {
            return true;
        }
    }
    catch (e) {}
    
    return false;
};

PULI_UTILS.trim = function (_str) {
    return _str.trim();
};