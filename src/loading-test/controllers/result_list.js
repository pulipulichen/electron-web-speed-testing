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
            result_data.data.data_type = main_page.data.request_jobs[_job_id].data_type;
            result_data.data.data = result_list.data.jobs_result[_job_id].data;
            
            if (typeof(result_data.data.data) !== "string" 
                    && typeof(result_data.data.data) !== "number") {
                result_data.data.data = JSON.stringify(result_data.data.data);
            }
            
            this.$emit('push-page', result_data);
        },
    }
};