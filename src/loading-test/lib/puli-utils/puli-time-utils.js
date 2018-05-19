if (typeof (PULI_UTILS) === "undefined") {
    PULI_UTILS = {};
}

PULI_UTILS.get_current_second = function () {
    var dateTime = Date.now();
    return dateTime;
};