request_config = {
    key: "request_config",
    data: {
        title: "Request Configuration",
        request_id: 0,
        enable_data_type_web: false,
        config_requests: {
            "url": "http://localhost/",
            "method": "get",
            "data_type": "text", //  application/json , text/html
            "send_data": "{}"
        }
    },
    methods: {
        check_enable_data_type_web: function () {
            if (typeof(electron) !== "undefined") {
                request_config.data.enable_data_type_web = true;
            }
            else {
                //request_config.data.enable_data_type_web = true;
                var _url = request_config.data.config_requests.url;
                request_config.data.enable_data_type_web = PULI_UTILS.is_same_origin(_url);
                if (request_config.data.enable_data_type_web === false 
                        && request_config.data.config_requests.data_type === "web") {
                    request_config.data.config_requests.data_type = "text";
                }
            }
            //console.log(request_config.data.enable_data_type_web);
        },
        open_request: function () {
            var _config = request_config.data.config_requests;
            PULI_UTILS.window_popup(_config);
        }
    }
};