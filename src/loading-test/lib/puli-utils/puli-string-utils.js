if (typeof(PULI_UTILS) === "undefined") {
    PULI_UTILS = {};
}


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

PULI_UTILS._uuid_counter = 0;
PULI_UTILS.create_uuid = function () {
    var _uuid = "puli_uuid_" + PULI_UTILS._uuid_counter;
    PULI_UTILS._uuid_counter++;
    return _uuid;
};