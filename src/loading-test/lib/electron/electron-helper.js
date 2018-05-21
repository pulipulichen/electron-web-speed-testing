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
    retrieve_web: function (_url, _method, _send_data, _callback) {
        if (typeof(_callback) !== "function") {
            return false;
        }
        
        if (typeof(_send_data) !== "string") {
            _send_data = JSON.stringify(_send_data);
        }
        
        var _callback_id = "retrieve_web_callback_" + this.create_uuid();
        
        ipcRenderer.on(_callback_id, function (event, _response, _status){
            _callback(_response, _status);
        });
        
        ipcRenderer.send('retrieve_web', _url, _method, _send_data, _callback_id);
    },
    uuid: 0,
    create_uuid: function () {
        var _uuid = this.uuid;
        this.uuid++;
        return _uuid;
    }
};