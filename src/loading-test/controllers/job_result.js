job_result = {
    key: "job_result",
    data: {
        title: "Job Result",
        job_id: 0,
        request_results: [{
            response: "",
            passed: true,
            loading_time: 0,
            status: 200,
            uri: "http://localhost",
            url: "http://localhost",
        }]
    },
    methods: {
        nav_request_result: function (_job_id, _request_id) {
            //console.log("nav_request_config" + _request_id);
            request_result.data.job_id = _job_id;
            request_result.data.request_id = _request_id;
            
            var _request_result = job_result.data.request_results[_request_id];
            var _request_config = main_page.data.config_requests[_request_id];
            
            request_result.data.uri = _request_result.uri;
            request_result.data.url = _request_result.url;
            request_result.data.method = _request_config.method;
            request_result.data.data_type = _request_config.data_type;
            request_result.data.send_data = _request_config.send_data;
            request_result.data.status = _request_result.status;
            request_result.data.response = _request_result.response;
            request_result.data.passed = _request_result.passed;
            request_result.data.response_time = _request_result.response_time;
            
            if (typeof(request_result.data.response) !== "string" 
                    && typeof(request_result.data.response) !== "number") {
                request_result.data.response = JSON.stringify(request_result.data.response);
            }
            
            
            this.$emit('push-page', request_result);
            
            setTimeout(function () {
                request_result.methods.write_response_iframe();
            }, 0);
        },
        
        save_job_result: function () {
            var _request_results = job_result.data.request_results;
            var _job_id = job_result.data.job_id + 1;
            var _output = {
                "results": []
            };
            for (var _j = 0; _j < _request_results.length; _j++) {
                var _result = _request_results[_j];
                var _config = main_page.data.config_requests[_j];

                var _row = {
                    'job_id': _job_id,
                    'result_id': (_j+1)
                };

                for (var _key in _result) {
                    if (_key === 'uri') {
                        continue;
                    }
                    var _row_key = _key;
                    if (_key === "data") {
                        _row_key = 'response';
                    }
                    _row[_row_key] = _result[_key];
                }

                for (var _key in _config) {
                    if (_key === 'uri') {
                        continue;
                    }
                    _row[_key] = _config[_key];
                }
                _output.results.push(_row);
            }
            //console.log(_output);
            
            var _filename = 'loading_test_' 
                    + 'job-' + _job_id + '_' 
                    + PULI_UTILS.get_yyyymmdd_hhmm() 
                    + ".ods";
            
            xlsx_helper_download("ods", _filename, _output);
        }
    }
};