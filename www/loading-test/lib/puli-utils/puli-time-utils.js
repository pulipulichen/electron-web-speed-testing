if (typeof (PULI_UTILS) === "undefined") {
    PULI_UTILS = {};
}

PULI_UTILS.get_current_second = function () {
    var dateTime = Date.now();
    return dateTime;
};

PULI_UTILS.pad2 = function (n) {  // always returns a string
    return (n < 10 ? '0' : '') + n;
};

/**
 * https://stackoverflow.com/a/19449076
 * @returns {String}
 */
PULI_UTILS.get_yyyymmdd_hhmm = function () {
    var date = new Date();

    return date.getFullYear() +
            PULI_UTILS.pad2(date.getMonth() + 1) +
            PULI_UTILS.pad2(date.getDate()) +
            "_" +
            PULI_UTILS.pad2(date.getHours()) +
            PULI_UTILS.pad2(date.getMinutes());
};