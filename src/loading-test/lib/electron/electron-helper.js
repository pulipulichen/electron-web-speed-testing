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
};