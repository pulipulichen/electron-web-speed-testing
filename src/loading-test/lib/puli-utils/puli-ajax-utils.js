if (typeof(PULI_UTILS) === "undefined") {
    PULI_UTILS = {};
}

PULI_UTILS.load_css = function (_css_url, _callback) {
    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', _css_url) );
    if (typeof(_callback) === "function") {
        _callback();
    }
    return true;
};

PULI_UTILS.window_popup = function (_config) {
    console.log(_config);
};