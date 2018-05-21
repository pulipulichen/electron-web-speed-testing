request_config = {
    key: "request_config",
    data: {
        title: "Request Configuration",
        request_id: 0,
        request_config: {
            "url": "http://localhost",
            "method": "get",
            "data_type": "text", //  application/json , text/html
            "send_data": "{}"
        }
    },
    methods: {
        request_open: function () {
            var _config = request_config.data.config_requests;
            PULI_UTILS.window_popup(_config);
        }
    }
};