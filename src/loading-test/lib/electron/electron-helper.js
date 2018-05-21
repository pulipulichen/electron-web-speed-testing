electron_helper = {
    open_window: function (_link, _target) {
        if (_target === undefined) {
            _target = "_blank";
        }
        
        if (typeof(ipcRenderer) === "undefined") {
            window.open(_link, _target);
        }
        else {
            ipcRenderer.send('open_window', _link);
        }
    },
    retrieve_web: function (_url, _method, _send_data, _referer, _callback) {
        if (typeof(_callback) !== "function") {
            return false;
        }
        
        var _send_data_string = [];
        for (var _key in _send_data) {
            _send_data_string.push(_key + "=" + _send_data[_key]);
        }
        _send_data_string = _send_data_string.join("&");
        
        var _callback_id = "retrieve_web_callback_" + this.create_uuid();
        
        ipcRenderer.on(_callback_id, function (event, _response, _status){
            _callback(_response, _status);
        });
        
        ipcRenderer.send('retrieve_web', _url, _method, _send_data, _referer, _callback_id);
    },
    uuid: 0,
    create_uuid: function () {
        var _uuid = this.uuid;
        this.uuid++;
        return _uuid;
    },
    set_item: function (_key, _value) {
        if (typeof(_value) !== 'string' && typeof(_value) !== 'number') {
            _value = JSON.stringify(_value);
        }
        ipcRenderer.send('set_item', _key, _value);
    },
    get_item: function (_key, _callback) {
        var _callback_id = "get_item_callback_" + this.create_uuid();
        ipcRenderer.on(_callback_id, function (event, _value){
            //console.log("有回來嗎");
            _callback(_value);
        });
        //console.log([_callback_id, _key]);
        ipcRenderer.send('get_item', _key, _callback_id);
    }
};