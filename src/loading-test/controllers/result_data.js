result_data = {
    key: "result_data",
    data: {
        result_id: "",
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
            var _config = result_data.data;
            PULI_UTILS.window_popup(_config);
        }
    }
};