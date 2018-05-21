request_config = {
    key: "request_config",
    data: {
        title: "Request Configuration",
        request_id: 0,
        enable_data_type_web: false,
        request_config: {
            "url": "http://localhost/",
            "method": "get",
            "data_type": "text", //  application/json , text/html
            "send_data": "{}"
        }
    },
    methods: {
        check_enable_data_type_web: function () {
            request_config.enable_data_type_web = true;
        },
        open_request: function () {
            var _config = request_config.data.config_requests;
            PULI_UTILS.window_popup(_config);
        }
    }
};