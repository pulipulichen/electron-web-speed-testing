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
    var _url = _config.url;
    var _method = _config.method.toLowerCase();
    
    var _send_data = _config.send_data;
    if (typeof(_send_data) !== "object") {
        try {
            eval("_send_data = " + _send_data);
        } catch (_e) {
            _send_data = {};
        }
    }
    
    if (_method === "get") {
        // 試著重組一下URL
        var _parameters = [];
        for (var _s in _send_data) {
            _parameters.push(_s + "=" + _send_data[_s]);
        }
        if (_parameters.length > 0) {
            _parameters = _parameters.join("&");
            var _url_parts = PULI_UTILS.parse_url(_url);
            if (_url_parts.search !== "") {
                _parameters = _url_parts.search + "&" + _parameters;
            }
            else {
                _parameters = "?" + _parameters;
            }
            _url_parts.search = _parameters;
            _url = PULI_UTILS.build_url(_url_parts);
        }
        
        window.open(_url);
    }
    else if (_method === "post") {
        var _window_name = "window_popup_" + PULI_UTILS.create_uuid();
        // 先建立send data的form
        var _form = $('<form method="post" action="' + _url + '" target="' + _window_name + '"></form>');
        for (var _s in _send_data) {
            _form.append('<input type="text" name="' + _s + '" value="' + _send_data[_s] + '" />');
        }
        
        // 開啟視窗
        var _win = window.open("", _window_name);
        
        // 送出
        _form.appendTo("body").hide().submit();
        setTimeout(function () {
            _form.remove();
        }, 0);
    }
};



/**
var l = getLocation("http://example.com/path");
console.debug(l.hostname)
>> "example.com"
console.debug(l.pathname)
>> "/path"

parser.protocol; // => "http:"
parser.host;     // => "example.com:3000"
parser.hostname; // => "example.com"
parser.port;     // => "3000"
parser.pathname; // => "/pathname/"
parser.hash;     // => "#hash"
parser.search;   // => "?search=test"
parser.origin;   // => "http://example.com:3000"
 * @param {type} _url
 * @returns {Element|PULI_UTILS.parse_url._a}
 */
PULI_UTILS.parse_url = function (_url) {
    var _a = document.createElement("a");
    _a.href = _url;
    return _a;
};

/**
parser.protocol; // => "http:"
parser.host;     // => "example.com:3000"
parser.hostname; // => "example.com"
parser.port;     // => "3000"
parser.pathname; // => "/pathname/"
parser.hash;     // => "#hash"
parser.search;   // => "?search=test"
parser.origin;   // => "http://example.com:3000"
 * @param {type} _url_parts
 * @returns {String}
 */
PULI_UTILS.build_url = function (_url_parts) {
    var _url = _url_parts.origin;
    _url = _url + _url_parts.pathname;
    _url = _url + _url_parts.search;
    _url = _url + _url_parts.hash;
    return _url;
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

PULI_UTILS.is_same_origin = function (_url1, _url2) {
    if (_url2 === undefined) {
        _url2 = location.href;
    }
    var _current_origin = PULI_UTILS.parse_url(_url1).origin;
    var _target_origin = PULI_UTILS.parse_url(_url2).origin;
    return (_current_origin === _target_origin);
};

PULI_UTILS.scroll_to = function (_id, _callback) {
    var _retry_limit = 3;
    var _retry_interval = 100;
    
    var _loop = function (_i) {
        if (_i === _retry_limit) {
            return;
        }
        
        if ($('#' + _id + ":visible").length === 0) {
            setTimeout(function () {
                _i++;
                _loop(_i);
            }, _retry_interval);
        }
        else {
            var _target = document.getElementById(_id);
            document.getElementById('panel_results_header').scrollIntoView({
                behavior: 'smooth'
            });
            if (typeof(_callback) === "function") {
                _callback();
            }
        }
    };
    _loop(0);
    
    return true;
};