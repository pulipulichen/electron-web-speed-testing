var _controllers_list = [
    "main_page",
    "request_config",
    "job_result",
    "request_result",
    "sliding_menu",
    "about"
];

// ---------------------------

var _load_controller_template = function (_callback) {
    $.get('core/controller.html', function (_controller_template) {
        $.get('controllers/sliding_menu.html', function (_sliding_menu_template) {
            _controller_template = _controller_template.replace('<v-ons-splitter-side />', _sliding_menu_template);
            _callback(_controller_template);
        });
    });
};

var _build_vue_setting = function (_callback) {
    var _first_controller_name = _controllers_list[0];
    var _first_controller = _controllers[_first_controller_name];
    
    var _vue_setting = {
        el: '#app',
        data: {
            pageStack: [_first_controller],
            sliding_menu: sliding_menu
        },
        created: _vue_create
    };
    
    _load_controller_template(function (_template) {
        _vue_setting.template = _template;
        _callback(_vue_setting);
    });
};

var _vue_create = function () {
    $(function () {
        // 先把每個controller的ready做完
        for (var _name in _controllers) {
            var _controller = _controllers[_name];
            if (typeof (_controller.methods) === "object"
                    && typeof (_controller.methods.ready) === "function") {
                _controller.methods.ready();
            }
        }

        vue_create_event();
    });
};

var _vue_ready = function (_vue_setting) {
    
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
    
    
    vm = new Vue(_vue_setting);
};

// ---------------------------

var _controllers = {};

var _loop = function (_i) {
    if (_i < _controllers_list.length) {
        var _name = _controllers_list[_i];
        PULI_UTILS.load_css("controllers/" + _name + ".css");
        //console.log(_name);
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
        //console.log("ok 1");
        _build_vue_setting(function (_vue_setting) {
            //console.log("ok");
            _vue_ready(_vue_setting);
        });
    }
};

_loop(0);