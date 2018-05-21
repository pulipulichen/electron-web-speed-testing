request_result = {
    key: "request_result",
    data: {
        job_id: 1,
        request_id: 1,
        uri: "",
        url: "",
        method: "",
        data_type: "",
        send_data: "",
        status: 200,
        passed: false,
        response: "{}"
    },
    methods: {
        open_request: function () {
            var _config = request_result.data;
            PULI_UTILS.window_popup(_config);
        }
    }
};