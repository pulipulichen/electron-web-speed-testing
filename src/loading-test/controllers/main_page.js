main_page = {
    key: "main_page",
    data: {
        title: "LOADING TEST",
        status_running: false,
        status_passed_job: 0,
        status_failed_job: 0,
        status_total_job: 3,
        status_percent: 0,
        status_average_spend_time: 0,

        request_jobs: [
            {
                "url": "http://localhost/nodejs-projects/electron-loading-test/[test]/wait.php",
                "method": "POST",
                "data_type" : "text", //  application/json , text/html
                "data": '{d:3}'
            },
            {
                "url": "http://localhost/a",
                "method": "POST",
                "data_type" : "text", //  application/json , text/html
                "data": "{}"
            },
        ],
        //config_base_url: "http://localhost/?a=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        
        //config_execute_mode: "simultaneously",  // simultaneously , queue
        config_execute_mode: "queue",  // simultaneously , queue

        results: [],
    },
    methods: {
        job_run: function () {
            //console.log("run");
            //console.log(vm);
            main_page.methods.results_clear();
            
            main_page.data.status_running = true;
            
            //var _url = main_page_vm.config_base_url;
            var _total_job = main_page.data.status_total_job;
            var _completed_jobs = 0;

            var _next = function (_results, _callback) {
                main_page.data.results.push(_results);

                // ------------

                if (_results.passed === true) {
                    main_page.data.status_passed_job++;
                }
                else {
                    main_page.data.status_failed_job++;
                }

                main_page.data.status_percent = Math.floor( (main_page.data.status_passed_job + main_page.data.status_failed_job) / main_page.data.status_total_job * 100 );
                main_page.methods.stat_average_spend_time();
                main_page.methods.update_title();

                // ------------

                _completed_jobs++;
                if (_completed_jobs === _total_job) {
                    main_page.methods.job_stop();
                }
                else {
                    if (typeof(_callback) === "function") {
                        _callback();
                    }
                }
            };

            if (main_page.data.config_execute_mode === "simultaneously") {
                for (var _i = 0; _i < _total_job; _i++) {
                    main_page.methods.run_request_jobs(function (_results) {
                        _next(_results);
                    });
                }
            }
            else if (main_page.data.config_execute_mode === "queue") {
                var _loop = function () {
                    main_page.methods.run_request_jobs(function (_results) {
                        _next(_results, function () {
                            _loop();
                        });
                    });
                };
                _loop();
            }
        },

        job_stop: function () {
            main_page.data.status_running = false;
        },

        results_clear: function () {
            main_page.data.results = [];
            main_page.data.status_passed_job = 0;
            main_page.data.status_failed_job = 0;
            main_page.data.status_percent = 0;
            main_page.data.status_average_spend_time = 0;
        },

        // ----------------------------------
        
        run_request_jobs: function (_callback) {
            if (typeof(_callback) !== "function") {
                return false;
            }
            
            var _start_time = PULI_UTILS.get_current_second();
            var _jobs = main_page.data.request_jobs;
            var _jobs_count = _jobs.length;
            var _results = {
                "url": null,
                "uri": null,
                "spend_time": -1,
                "passed": false,
                "passed_count": 0,
                "jobs_result": [],
            };
            
            var _loop = function (_j) {
                //console.log(_j);
                if (_j < _jobs_count) {
                    var _config = _jobs[_j];
                    main_page.methods.run_text_job(_config, function (_result) {
                        _results.jobs_result.push(_result);
                        //console.log(_result);
                        if (_result.passed === true) {
                            _results.passed_count++;
                        }
                        _loop(_j+1);
                    });
                }
                else {
                    var _end_time = PULI_UTILS.get_current_second();
                    var _spend_time = Math.floor(_end_time - _start_time) / 1000;
                    _results.spend_time = _spend_time;
                    _results.passed = (_results.passed_count === _jobs_count);
                    
                    var _first_result = _results.jobs_result[0];
                    _results.uri = _first_result.uri;
                    _results.url = _first_result.url;
                    
                    _callback(_results);
                }
            };
            _loop(0);
        },

        run_text_job: function (_config, _callback) {
            if (typeof(_callback) !== "function" 
                    || main_page.data.status_running === false) {
                return;
            }

            var _start_time = null;
            var _url = _config.url;
            var _method = _config.method;
            var _data = undefined;
            //console.log(_config);
            try {
                //_data = JSON.parse(_config.data);
                eval("_data = " + _config.data);
                //console.log(_data);
                if (typeof(_data) !== "object") {
                    _data = undefined;
                }
            }
            catch (_e) {};

            var _status;
            var _ajax_complete = function (_s) {
                _status = _s;
            };
            
            var _ajax_always = function( _url_return ) {
                if (_status === undefined) {
                    setTimeout(function () {
                        _ajax_always(_url_return);
                    },0);
                    return;
                }
                
                if (typeof(_url_return) === "object" 
                        && typeof(_url_return.responseText) === "string") {
                    _url_return = _url_return.responseText;
                }
                
                var _passed = (_status === 200);
                var _end_time = PULI_UTILS.get_current_second();
                var _spend_time = Math.floor(_end_time - _start_time) / 1000;

                var _uri = main_page.methods.shrink_uri(_url);

                var _result = {
                    spend_time: _spend_time,
                    status: _status,
                    passed: _passed,
                    url: _url,
                    uri: _uri,
                    data: _url_return
                };

                if (main_page.data.status_running === true) {
                    _callback(_result);
                }
            };
            
            
            var _ajax_setting = {
                url: _url,
                method: _method,
                data: _data,
                beforeSend: function () {
                    _start_time = PULI_UTILS.get_current_second();
                },
                //success: function (_data, _textStatus, _xhr) {
                //    _ajax_complete(_xhr.status);
                //},
                complete: function (_xhr, _textStatus) {
                    _ajax_complete(_xhr.status);
                },
                cache: false
            };

            $.ajax(_ajax_setting).always(_ajax_always);
        },
        
        shrink_uri: function (_url) {
            var _uri = PULI_UTILS.parse_uri(_url);
            if (_uri.length < 10) {
                _uri = _url;
            }
            else if (_uri.length > 30) {
                _uri = _uri.substr(0, 30) + "...";
            }
            return _uri;
        },

        stat_average_spend_time: function () {
            var _total = 0;
            for (var _i in main_page.data.results) {
                _total = _total + main_page.data.results[_i].spend_time;
            }
            var _avg = Math.floor((_total / main_page.data.results.length) * 1000) / 1000;
            main_page.data.status_average_spend_time = _avg;
        },

        update_title: function () {
            var _title = main_page.data.title;

            if (main_page.data.status_percent > 0) {
                _title = main_page.data.status_percent + "% (" + main_page.data.status_average_spend_time + "s)";
            }

            document.title = _title;
        },

        jump_to_config: function () {
            document.getElementById('panel_configuration').scrollIntoView({
                behavior: 'smooth'
              });
        },
        
        // ---------------
        
        nav_request_config: function (_request_id) {
            //console.log("nav_request_config" + _request_id);
            request_config.data.request_id = _request_id;
            request_config.data.request_config = main_page.data.request_jobs[_request_id];
            
            this.$emit('push-page', request_config);
        },
        
        add_request_job: function (_index) {
            //console.log(_index);
            
            var _jobs = main_page.data.request_jobs;
            //var _template = main_page.data.request_job_template;
            var _template = _jobs[_index];
            _template = JSON.parse(JSON.stringify(_template));
            _jobs.splice(_index+1, 0, _template);
        },
        
        remove_request_job: function (_index) {
            //console.log(_index);
            
            var _jobs = main_page.data.request_jobs;
            if (_jobs.length < 2 || _index >= _jobs.length || _index < 0) {
                return false;
            }
            else {
                if (window.confirm("Are you sure to delete reuqest job #" + _index + " ?")) {
                    _jobs.splice(_index, 1);
                }
            }
        },
        
        // ---------------
        
        nav_result_detail: function (_result_id) {
            //console.log(_index);
            result_list.data.request_id = _result_id;
            result_list.data.jobs_result = main_page.data.results[_result_id].jobs_result;
            
            this.$emit('push-page', result_list);
        },
    }
};
