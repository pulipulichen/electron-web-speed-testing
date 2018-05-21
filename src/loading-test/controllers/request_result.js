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
        response: "{}",
        response_time: 0
    },
    methods: {
        open_request: function () {
            var _config = request_result.data;
            PULI_UTILS.window_popup(_config);
        },
        write_response_iframe: function () {
            var _url = request_result.data.url;
            var _html = request_result.data.response;
            
            // 想辦法加入<base>
            _html = '<base href="' + _url + '" />' + _html;
            //document.getElementById("response_iframe").content
            console.log(_html);
            var _doc = document.getElementById('response_iframe').contentWindow.document;
            //doc.open();
            _doc.write(_html);
            //doc.close();
        },
        edit_request_config: function () {
            main_page.methods.nav_request_config(request_result.data.request_id);
        }
    }
};