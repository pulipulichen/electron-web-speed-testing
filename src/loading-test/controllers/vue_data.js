vue_data = {
    title: "LOADING TEST",
    status_running: false,
    status_passed_job: 0,
    status_failed_job: 0,
    status_total_job: 100,
    status_percent: 0,
    status_average_spend_time: 0,

    config_base_url: "http://localhost/",

    results: [{start_time:1}],

    // --------------------------
    
    job_run: function () {
        //console.log("run");
        //console.log(vm);
        vm.results_clear();
        
        vm.status_running = true;
        
        var _url = vm.config_base_url;
        var _total_job = vm.status_total_job;
        var _completed_jobs = 0;
        
        for (var _i = 0; _i < _total_job; _i++) {
            var _config = {
                base_url: _url
            };
            vm.single_test_run(_config, function (_result) {
                if (_result.passed === true) {
                    vm.status_passed_job++;
                }
                else {
                    vm.status_failed_job++;
                }
                
                vm.results.push(_result);
                vm.status_percent = Math.floor( (vm.status_passed_job + vm.status_failed_job) / vm.status_total_job * 100 );
                vm.stat_average_spend_time();
                vm.update_title();
                
                _completed_jobs++;
                if (_completed_jobs === _total_job) {
                    vm.job_stop();
                }
            });
        }
    },
    job_stop: function () {
        vm.status_running = false;
    },
    results_clear: function () {
        vm.results = [];
        vm.status_passed_job = 0;
        vm.status_failed_job = 0;
        vm.status_percent = 0;
        vm.status_average_spend_time = 0;
    },
    
    // ----------------------------------
    
    single_test_run: function (_config, _callback) {
        if (typeof(_callback) !== "function" || vm.status_running === false) {
            return;
        }
        
        var _start_time = null;
        var _url = _config.base_url;
        
        var _ajax_callback = function (_status) {
            var _passed = (_status === 200);
            var _end_time = vm.get_current_second();
            var _spend_time = Math.floor(_end_time - _start_time) / 1000;
            
            var _result = {
                spend_time: _spend_time,
                status: _status,
                passed: _passed
            };
            
            if (vm.status_running === true) {
                _callback(_result);
            }
        };
        
        $.ajax({
            url: _url,
            beforeSend: function () {
                _start_time = vm.get_current_second();
            },
            success: function (_data, _textStatus, _xhr) {
                _ajax_callback(_xhr.status);
            },
            complete: function (_xhr, _textStatus) {
                _ajax_callback(_xhr.status);
            },
            cache: false
        });
    },
    
    get_current_second: function () {
        var dateTime = Date.now();
        return dateTime;
    },
    
    stat_average_spend_time: function () {
        var _total = 0;
        for (var _i in vm.results) {
            _total = _total + vm.results[_i].spend_time;
        }
        var _avg = Math.floor((_total / vm.results.length) * 1000) / 1000;
        vm.status_average_spend_time = _avg;
    },
    
    update_title: function () {
        var _title = vm.title;
        
        if (vm.status_percent > 0) {
            _title = vm.status_percent + "% (" + vm.status_average_spend_time + "s)";
        }
        
        document.title = _title;
    },
    
    jump_to_config: function () {
        document.getElementById('panel_configuration').scrollIntoView({
            behavior: 'smooth'
          });
    },
};

vue_create = function () {
    setTimeout(function () {
        vm.results_clear();
    });
};