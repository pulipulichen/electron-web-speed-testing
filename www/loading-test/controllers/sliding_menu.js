sliding_menu = {
    key: "sliding_menu",
    data: {
        opened: false,
        mode: 'collapse'
    },
    methods: {
        modechange: function (_mode) {
            //console.log(_mode);
            if (_mode === undefined) {
                _mode = $("ons-splitter-side").attr("mode");
            }
            
            sliding_menu.data.mode = _mode;
            
            var _main_content = $('ons-splitter-content#main_content');
            if (_mode === 'split') {
                _main_content.addClass('split');
            }
            else {
                _main_content.removeClass('split');
            }
        },
        open: function () {
            sliding_menu.data.opened = true;
        },
        close: function () {
            sliding_menu.data.opened = false;
        },
        /*
        ready: function () {
            var _mode = $('#sliding_menu').attr('mode');
            if (_mode === undefined) {
                setTimeout(function () {
                    sliding_menu.methods.ready();
                }, 0);
            }
            else {
                sliding_menu.methods.modechange(_mode);
                //console.log(_mode);
            }
        },
        */
       ready: function () {
           setTimeout(function () {
               sliding_menu.methods.modechange();
           }, 0);
       }
    }
};