var _controllers_list = [
    "main_page",
    "request_config"
    //"page2"
];

// ---------------------------


var _vue_ready = function () {
    var _first_controller_name = _controllers_list[0];
    var _first_controller = _controllers[_first_controller_name];
    //console.log(_first_controller);
    
    /*
    for (var _name in _controllers) {
        var _controller = _controllers[_name];
        eval(_name + "_vm = _controller");
        //eval(_name + "_vm = new Vue(_controller)");
        //console.log("const " + _name + "_vm = new Vue(_controller)");
        //eval("const " + _name + "_vm = new Vue(_controller)");
    }
    */
    
    
    vm = new Vue({
        el: '#app',
        //template: _first_controller.template,
        //data: _first_controller.data,
        template: '#controller',
        data: {
            pageStack: [_first_controller]
        },
        created: vue_create_event,
    });
};

// ---------------------------

var _controllers = {};

var _loop = function (_i) {
    if (_i < _controllers_list.length) {
        var _name = _controllers_list[_i];
        PULI_UTILS.load_css("controllers/" + _name + ".css");
        $.getScript("controllers/" + _name + ".js", function () {
            $.get("controllers/" + _name + ".html", function (_template) {
                /*
                var _data = {};
                try {
                    eval("var _data = " + _name + "_data");
                }
                catch (_e) {}
                
                var _methods = {};
                try {
                    eval("var _methods = " + _name + "_methods");
                }
                catch (_e) {}

                _controllers[_name] = {
                    key: _name,
                    template: _template,
                    data: _data,
                    methods: _methods
                };
                */
                var _vm = {};
                try {
                    eval("var _vm = " + _name);
                }
                catch (_e) {
                    _vm.key = _name;
                }
                _vm.template = _template;
                
                _controllers[_name] = _vm;
                _i++;
                _loop(_i);
            });
        });
    }
    else {
        _vue_ready();
    }
};

_loop(0);