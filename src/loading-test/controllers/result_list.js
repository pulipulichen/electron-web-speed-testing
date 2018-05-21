result_list = {
    key: "result_list",
    data: {
        title: "Results",
        result_id: 0,
        jobs_result: [{
            data: "",
            passed: true,
            spend_time: 0,
            status: 200,
            uri: "http://localhost",
            url: "http://localhost",
        }]
    },
    methods: {
        nav_result_data: function (_result_id, _job_id) {
            //console.log("nav_request_config" + _request_id);
            result_data.data.result_id = _result_id + "-" + _job_id;
            result_data.data.uri = result_list.data.jobs_result[_job_id].uri;
            result_data.data.url = result_list.data.jobs_result[_job_id].url;
            result_data.data.method = main_page.data.config_jobs[_job_id].method;
            result_data.data.data_type = main_page.data.config_jobs[_job_id].data_type;
            result_data.data.send_data = main_page.data.config_jobs[_job_id].send_data;
            result_data.data.status = result_list.data.jobs_result[_job_id].status;
            result_data.data.response = result_list.data.jobs_result[_job_id].data;
            result_data.data.passed = result_list.data.jobs_result[_job_id].passed;
            
            if (typeof(result_data.data.response) !== "string" 
                    && typeof(result_data.data.response) !== "number") {
                result_data.data.response = JSON.stringify(result_data.data.response);
            }
            
            this.$emit('push-page', result_data);
        },
        
        save_results_details: function () {
            var _jobs_result = result_list.data.jobs_result;
            var _request_id = result_list.data.request_id + 1;
            var _output = {
                "results": []
            };
            for (var _j = 0; _j < _jobs_result.length; _j++) {
                var _job_result = _jobs_result[_j];
                var _config = main_page.data.config_jobs[_j];

                var _row = {
                    'request_id': _request_id,
                    'job_id': (_j+1)
                };

                for (var _key in _job_result) {
                    if (_key === 'uri') {
                        continue;
                    }
                    var _row_key = _key;
                    if (_key === "data") {
                        _row_key = 'response';
                    }
                    _row[_row_key] = _job_result[_key];
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
            
            var _filename = 'loading_test_results_' + _request_id + '_' + PULI_UTILS.get_yyyymmdd_hhmm() + ".ods";
            
            xlsx_helper_download("ods", _filename, _output);
        }
    }
};