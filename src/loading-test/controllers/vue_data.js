vue_data = {
    status_running: false,
    status_passed_job: 0,
    status_failed_job: 0,
    status_total_job: 0,

    config_base_url: "http://127.0.0.1",

    // --------------------------

    job_run: function () {
        //console.log("run");
        //console.log(vm);
        vm.status_running = true;
    },
    job_stop: function () {
        //console.log("stop");
        vm.status_running = false;
    },

};