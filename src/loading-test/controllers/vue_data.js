vue_data = {
    status_running: false,
    status_passed_job: 0,
    status_failed_job: 0,
    status_total_job: 0,

    config_base_url: "http://127.0.0.1",

    results: [{start_time:1}],

    // --------------------------
    
    job_run: function () {
        //console.log("run");
        //console.log(vm);
        
        vm.status_running = true;
        
        /*
        vm.results.push({
            start_time: 0,
            end_time: 10,
            status: 200,
            passed: true
        });
        */
       /*
        vm.$set('results', [{
            start_time: 0,
            end_time: 10,
            status: 200,
            passed: true
        }]);
        */
        vm.addResult();
    },
    addResult: function () {
        vm.results.push({
            start_time: 0,
            end_time: 10,
            status: 200,
            passed: true
        });
    },
    job_stop: function () {
        //console.log("stop");
        vm.status_running = false;
        //vm.results = [];
        //vm.$forceUpdate();
        vm.results = [];
    },
    
    results_clear: function () {
        vm.results = [];
        /*
        while (vm.results.length > 0) {
            vm.results.pop();
        }
        */
    }
};

vue_create = function () {
    setTimeout(function () {
        vm.results_clear();
    });
};