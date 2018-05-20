if (typeof(PULI_UTILS) === "undefined") {
    PULI_UTILS = {};
}

PULI_UTILS.is_int = function (_input) {
    if (typeof(_input) !== "number") {
        _input = parseInt(_input, 10);
    }
    if (isNaN(_input)) {
        return false;
    }
    
    if ( (_input + "").indexOf(".") > -1 ) {
        return false;
    }
    
    return true;
};