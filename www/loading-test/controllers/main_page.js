main_page = {
    key: "main_page",
    data: {
        title: "LOADING TEST",
        
        config_job_number: 3,
        config_execute_mode: "parallel",  // parallel , queue
        
        status_running: false,
        status_passed_job: 0,
        status_failed_job: 0,
        
        status_percent: 0,
        status_average_response_time: 0,

        config_requests: [
            {
                //"url": "http://localhost/nodejs-projects/electron-loading-test/[test]/wait.php",
                //"url": "http://localhost/nodejs-projects/electron-loading-test/[test]/relative.html",
                //"url": "http://blog.pulipuli.info/",
                //"url": "http://dlll.nccu.edu.tw/",
                "url": "http://localhost/",
                
                "method": "GET", // GET, POST
                "data_type" : "web", //  text, json , web
                "send_data": '{test:true}'
            },
            {
                //"url": "http://www.google.com.tw",
                "url": "http://blog.pulipuli.info/",
                "method": "GET",
                "data_type" : "web", //  application/json , text/html
                "send_data": "{q: 'test'}"
            },
        ],
        //config_base_url: "http://localhost/?a=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        
        //config_execute_mode: "simultaneously",  // simultaneously , queue
        
        //ui_sliding_menu_open: false,
        //ui_sliding_menu_mode: "collpse",

        response_results: [],
    },
    methods: {
        start_test: function () {
            //var _url = main_page_vm.config_base_url;
            var _total_job = main_page.data.config_job_number;
            if (_total_job > CONFIG.max_job_number) {
                vm.$ons.notification.alert(i18n.t('Max job number is ') + CONFIG.max_job_number);
                return;
            }
            
            //console.log("run");
            //console.log(vm);
            main_page.methods.clear_results();
            
            main_page.data.status_running = true;
            
            
            var _completed_jobs = 0;

            var _next = function (_results, _callback) {
                if (_completed_jobs === _total_job || _completed_jobs > _total_job) {
                    return;
                }
                
                main_page.data.response_results.push(_results);

                // ------------

                if (_results.passed === true) {
                    main_page.data.status_passed_job++;
                }
                else {
                    main_page.data.status_failed_job++;
                }

                main_page.data.status_percent = Math.floor( (main_page.data.status_passed_job + main_page.data.status_failed_job) / main_page.data.config_job_number * 100 );
                main_page.methods.stat_average_response_time();
                main_page.methods.update_title();

                // ------------

                _completed_jobs++;
                if (_completed_jobs === _total_job || _completed_jobs > _total_job) {
                    main_page.methods.stop_test();
                }
                else {
                    if (typeof(_callback) === "function") {
                        _callback();
                    }
                }
            };

            if (main_page.data.config_execute_mode === "parallel") {
                for (var _i = 0; _i < _total_job; _i++) {
                    main_page.methods.run_job(function (_results) {
                        _next(_results);
                    });
                }
            }
            else if (main_page.data.config_execute_mode === "queue") {
                var _loop = function () {
                    main_page.methods.run_job(function (_results) {
                        _next(_results, function () {
                            _loop();
                        });
                    });
                };
                _loop();
            }
        },

        stop_test: function () {
            main_page.data.status_running = false;
        },

        clear_results: function () {
            main_page.data.response_results = [];
            
            main_page.data.status_passed_job = 0;
            main_page.data.status_failed_job = 0;
            main_page.data.status_percent = 0;
            main_page.data.status_average_response_time = 0;
        },

        // ----------------------------------
        
        run_job: function (_callback) {
            if (typeof(_callback) !== "function") {
                return false;
            }
            
            var _start_time = PULI_UTILS.get_current_second();
            var _config_requests = main_page.data.config_requests;
            var _requests_count = _config_requests.length;
            var _results = {
                "url": null,
                "uri": null,
                "response_time": -1,
                "passed": false,
                "passed_count": 0,
                "failed_count": 0,
                "failed_message": "",
                "request_results": [],
            };
            var _failed_url_list = [];
            
            var _loop = function (_j) {
                if (main_page.data.status_running === false) {
                    return;
                }
                
                //console.log(_j);
                if (_j < _requests_count) {
                    var _config = _config_requests[_j];
                    var _request_callback = function (_result) {
                        _results.request_results.push(_result);
                        //console.log(_result);
                        if (_result.passed === true) {
                            _results.passed_count++;
                        }
                        else {
                            _results.failed_count++;
                            _failed_url_list.push(main_page.methods.shrink_uri(_config.url));
                        }
                        _loop(_j+1);
                    };
                    
                    var _data_type = _config.data_type;
                    if (typeof(electron) === "undefined") {
                        if (_data_type === "web" && PULI_UTILS.is_same_origin(_config.url) === false) {
                            _data_type = "text";
                        }
                    }
                    
                    if (_data_type === "text" || _data_type === "json") {
                        main_page.methods.run_text_request(_config, _request_callback);
                    }
                    else if (_data_type === "web") {
                        if (ELECTRON_ENABLE === true) {
                            if (typeof(_config.referer) !== "string") {
                                var _referer = _config.url;
                                if (_j > 0) {
                                    _referer = _config_requests[(_j-1)].url;
                                }
                                _config.referer = _referer;
                            }
                            
                            main_page.methods.run_web_request_electron(_config, _request_callback);
                        }
                        else {
                            main_page.methods.run_web_request(_config, _request_callback);
                        }
                    }
                }
                else {
                    var _end_time = PULI_UTILS.get_current_second();
                    var _response_time = Math.floor(_end_time - _start_time) / 1000;
                    _results.response_time = _response_time;
                    _results.passed = (_results.passed_count === _requests_count);
                    
                    var _first_result = _results.request_results[0];
                    _results.uri = _first_result.uri;
                    _results.url = _first_result.url;
                    
                    _results.failed_message = _failed_url_list.join(", ");
                    
                    _callback(_results);
                }
            };
            _loop(0);
        },

        run_text_request: function (_config, _callback) {
            if (typeof(_callback) !== "function") {
                return;
            }

            var _start_time = null;
            var _url = _config.url;
            var _method = _config.method;
            var _send_data = main_page.methods.parse_json(_config.send_data);

            //var _status = "Deny Access-Control-Allow-Origin";
            var _status;
            var _ajax_complete = function (_s) {
                if (_s === 0) {
                    _s = "Deny Access-Control-Allow-Origin";
                }
                    
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
                
                // 如果資料形態是JSON，那就要多一個檢查
                if (_config.data_type === "json") {
                    if (PULI_UTILS.is_json(_url_return, true) === false) {
                        _passed = false;
                        _status = "Responsed data type is not JSON";
                    }
                }
                
                var _end_time = PULI_UTILS.get_current_second();
                var _response_time = Math.floor(_end_time - _start_time) / 1000;

                var _uri = main_page.methods.shrink_uri(_url);

                var _result = {
                    response_time: _response_time,
                    status: _status,
                    passed: _passed,
                    url: _url,
                    uri: _uri,
                    response: _url_return
                };

                if (main_page.data.status_running === true) {
                    _callback(_result);
                }
            };
            
            var _ajax_setting = {
                url: _url,
                method: _method,
                data: _send_data,
                beforeSend: function () {
                    _start_time = PULI_UTILS.get_current_second();
                },
                complete: function (_xhr) {
                    _ajax_complete(_xhr.status);
                },
                cache: false,
                crossDomain: true
            };

            $.ajax(_ajax_setting).always(_ajax_always);
        },
        
        run_web_request: function (_config, _callback) {
            if (typeof(_callback) !== "function") {
                return;
            }

            var _start_time = null;
            var _url = _config.url;
            var _method = _config.method;
            var _send_data = main_page.methods.parse_json(_config.send_data);
            var _status = 200;
            var _loading = true;
            var _response = "";
            
            var _timeout_timer = setTimeout(function () {
                _status = "Timeout";
                _loading = false;
                _complete();
            }, CONFIG.web_load_limit * 1000);
            
            var _iframe_name = "run_web_request_iframe_" + PULI_UTILS.create_uuid();
            var _iframe = $('<iframe style="display: none;" name="' + _iframe_name + '" id="' + _iframe_name + '"></iframe>')
                    .appendTo("body");
            
            _iframe.load(function () {
                if (_loading === false) {
                    return;
                }
                clearTimeout(_timeout_timer);
                //console.log(_event);
                //console.log(this);
                //return;
                
                //console.log($(this).find("html").html());
                //console.log("load");
                
                var _iframe_document = this.contentDocument || this.contentWindow.document;
                
                //console.log(_iframe_document.location.href);
                //console.log(_iframe_document.title);
                if (_iframe_document.location.href === "about:blank") {
                    return;
                }
                
                var _html = _iframe_document.querySelector("html").innerHTML;
                _html = '<html>' + _html + '</html>';
                _response = _html;
                _complete();
                
                //console.log($(_iframe_document).html());
                //console.log(_html);
                //console.log(_status);
                //DOC = _iframe_document;
            });
            /*
            _iframe.attr("onerror", function () {
                return;
                //console.log("error");
                var _iframe_document = this.contentDocument || this.contentWindow.document;
                
                console.log(_iframe_document.location.href);
                console.log(_iframe_document.title);
                
                _status = "Load failed";
            });
            */
            
            var _form = $('<form style="display:none;" action="' + _url + '" target="' + _iframe_name + '" method="' + _method + '"></form>')
                    .appendTo("body");
            for (var _name in _send_data) {
                $('<input name="' + _name + '" value="' + _send_data[_name] + '" />')
                        .appendTo(_form);
            }
            
            var _complete = function () {
                var _end_time = PULI_UTILS.get_current_second();
                var _response_time = Math.floor(_end_time - _start_time) / 1000;
                var _uri = main_page.methods.shrink_uri(_url);
                var _passed = (_status === 200);
                
                var _result = {
                    response_time: _response_time,
                    status: _status,
                    passed: _passed,
                    url: _url,
                    uri: _uri,
                    response: _response
                };
                
                if (main_page.data.status_running === true) {
                    _callback(_result);
                }
                
                _iframe.remove();
                _form.remove();
            };
            
            /*
            _form.on("error", function() {
            console.log( "Handler for .error() called." )
          })
          _iframe.on("error", function() {
            console.log( "Handler for .error() called." )
          });
          
          window.onerror = function(error, url, line) {
                console.log("抓到錯誤了");
            };
            */
            
            _start_time = PULI_UTILS.get_current_second();
            /*
            try {
                _form.submit();
            }
            catch (e) {
                console.log("error");
            }
            */
            _form.submit();
        },
        
        run_web_request_electron: function (_config, _callback) {
            if (typeof(_callback) !== "function") {
                return;
            }

            var _start_time = null;
            var _url = _config.url;
            var _method = _config.method;
            var _send_data = main_page.methods.parse_json(_config.send_data);
            var _referer = _config.referer;
            //var _status = 200;
            
            _start_time = PULI_UTILS.get_current_second();
            
            electron_helper.retrieve_web(_url, _method, _send_data, _referer, function (_response, _status) {
                var _end_time = PULI_UTILS.get_current_second();
                var _response_time = Math.floor(_end_time - _start_time) / 1000;
                var _uri = main_page.methods.shrink_uri(_url);
                
                var _passed = (_status === 200);
                
                var _result = {
                    response_time: _response_time,
                    status: _status,
                    passed: _passed,
                    url: _url,
                    uri: _uri,
                    response: _response
                };
                
                if (main_page.data.status_running === true) {
                    _callback(_result);
                }
            });
        },
        
        parse_json: function (_json) {
            var _output = {};
            try {
                //_data = JSON.parse(_config.data);
                eval("_output = " + _json);
                //console.log(_data);
                if (typeof(_output) !== "object") {
                    _output = undefined;
                }
            }
            catch (_e) {};
            return _output;
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

        stat_average_response_time: function () {
            var _total = 0;
            for (var _i in main_page.data.response_results) {
                _total = _total + main_page.data.response_results[_i].response_time;
            }
            var _avg = Math.floor((_total / main_page.data.response_results.length) * 1000) / 1000;
            
            _avg = _avg / main_page.data.config_requests.length;
            
            main_page.data.status_average_response_time = _avg;
            
            var _comment = "Bad. The system is failed to keep the user.";
            if (_avg <= 0.1) {
                _comment = "Excellent! The system is reacting instantaneously.";
            }
            else if (_avg <= 1) {
                _comment = "Good! The user's flow of thought still stay uninterrupted.";
            }
            else if (_avg <= 10) {
                _comment = "OK. The user's attention still focused on the system.";
            }
            main_page.data.status_average_response_time_comment = i18n.t(_comment, false);
        },

        update_title: function () {
            var _title = null;

            if (main_page.data.status_percent > 0 && main_page.data.status_percent < 100) {
                _title = "(" + main_page.data.status_average_response_time + "s) " + main_page.data.status_percent + "%";
            }
            else if (main_page.data.status_percent === 100) {
                _title = "(" + main_page.data.status_average_response_time + "s) " + i18n.t(main_page.data.title);
            }
            else {
                _title = i18n.t(main_page.data.title);
            }

            document.title = _title;
        },

        /**
         * @returns true
         */
        jump_to_config: function () {
            main_page.methods.nav_main_page();
            sliding_menu.methods.close();
            return PULI_UTILS.scroll_to("panel_configuration_header");
        },
        
        /**
         * @returns true
         */
        jump_to_results: function () {
            main_page.methods.nav_main_page();
            sliding_menu.methods.close();
            return PULI_UTILS.scroll_to("panel_results_header");
        },
        
        // ---------------
        
        nav_request_config: function (_request_id) {
            main_page.methods.nav_main_page();
            
            //console.log("nav_request_config" + _request_id);
            request_config.data.job_id = _request_id;
            request_config.data.config_requests = main_page.data.config_requests[_request_id];
            request_config.methods.check_enable_data_type_web();
            //this.$emit('push-page', request_config);
            
            vm.$data.pageStack.push(request_config);
        },
        
        add_request: function (_index) {
            //console.log(_index);
            var _jobs = main_page.data.config_requests;
            //var _template = main_page.data.request_job_template;
            var _template = _jobs[_index];
            _template = JSON.parse(JSON.stringify(_template));
            _jobs.splice(_index+1, 0, _template);
        },
        
        remove_request: function (_index) {
            //console.log(_index);
            var _requests = main_page.data.config_requests;
            if (_requests.length < 2 || _index >= _requests.length || _index < 0) {
                return false;
            }
            else {
                var _message = i18n.t("Are you sure to delete reuqest") + " #" + (_index + 1) + "?";
                vm.$ons.notification.confirm({
                    message: _message,
                    callback: function (_result) {
                        //console.log(_result);
                        if (_result === 1) {
                            _requests.splice(_index, 1);
                        }
                    }
                });
            }
        },
        
        // ---------------
        
        nav_job_result: function (_job_id) {
            //console.log(_index);
            job_result.data.job_id = _job_id;
            job_result.data.request_results = main_page.data.response_results[_job_id].request_results;
            
            this.$emit('push-page', job_result);
        },
        
        nav_about: function () {
            //_vue_setting.data.stacks.$emit('push-page', about);
            vm.$data.pageStack.push(about);
            sliding_menu.methods.close();
        },
        
        nav_main_page: function () {
            //_vue_setting.data.stacks.$emit('push-page', about);
            while (vm.$data.pageStack.length > 1) {
                vm.$data.pageStack.pop();
            }
        },
        
        // ----------------
        
        //open_sliding_menu: function () {
        //    main_page.data.ui_sliding_menu_open = true;
        //},
        
        // -----------------
        
        //ready: function () {
        //    window.addEventListener('resize', function () {
        //        if (document.getElementById("sliding_menu") !== null) {
        //            main_page.data.ui_sliding_menu_mode = document.getElementById("sliding_menu").mode;
        //        }
        //    });
            
        //    if (document.getElementById("sliding_menu") !== null) {
        //        main_page.data.ui_sliding_menu_mode = document.getElementById("sliding_menu").mode;
        //    }
        //},
        ready: function () {
            main_page.methods.setup_config_auto_save();
        },
        
        setup_config_auto_save: function () {
            var _config;
            var _key = 'loading_test_config';
            $(window).unload(function () {
                _config = main_page.methods.get_config();
                _config = JSON.stringify(_config);
                if (ELECTRON_ENABLE === false) {
                    localStorage.setItem(_key, _config);
                }
                else {
                    _config = electron_helper.set_item(_key, _config);
                }
            });

            if (ELECTRON_ENABLE === false) {
                _config = localStorage.getItem("loading_test_config");
                if (_config !== null && CONFIG.enable_config_auto_save === true) {
                    main_page.methods.set_config(_config);
                }
            }
            else {
                //console.log("check");
                electron_helper.get_item(_key, function (_config) {
                    //console.log(_config);
                    if (_config !== null && CONFIG.enable_config_auto_save === true) {
                        main_page.methods.set_config(_config);
                    }
                });
            }
        },
        
        // --------------------
        
        save_config: function () {
            var _config = main_page.methods.get_config();
            
            var _filename = 'loading_test_config_' + PULI_UTILS.get_yyyymmdd_hhmm() + ".ods";
            
            xlsx_helper_download("ods", _filename, _config);
        },
        
        get_config: function () {
            var _data = main_page.data;
            var _config = {
                "global": {
                    "version": CONFIG.version,
                    "job number": _data.config_job_number,
                    "execute mode": _data.config_execute_mode
                },
                "config_requests": _data.config_requests
            };
            return _config;
        },
        
        load_config: function () {
            xlsx_helper_open(function (_config) {
                //console.log(_config);
                main_page.methods.set_config(_config);
            });
        },
        
        set_config: function (_config) {
            if (typeof(_config) === "string") {
                _config = JSON.parse(_config);
            }
            
            var _data = main_page.data;
                
            var _global = _config.global;
            _data.config_job_number = parseInt(_global["job number"], 10);
            _data.config_execute_mode = _global["execute mode"];

            _data.config_requests = _config.config_requests;
        },
        
        // ------------------------
        
        save_response_results: function () {
            var _results = main_page.data.response_results;
            var _output = {
                "results": []
            };
            for (var _i = 0; _i < _results.length; _i++) {
                var _job_id = (_i+1);
                var _request_results = _results[_i].request_results;
                
                for (var _j = 0; _j < _request_results.length; _j++) {
                    var _result = _request_results[_j];
                    var _config = main_page.data.config_requests[_j];
                    
                    var _row = {
                        'job_id': _job_id,
                        'request_id': (_j+1)
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
            }
            //console.log(_output);
            
            var _filename = 'loading_test_response_' + PULI_UTILS.get_yyyymmdd_hhmm() + ".ods";
            
            xlsx_helper_download("ods", _filename, _output);
        }
    }
};
