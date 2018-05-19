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
            result_data.data.method = main_page.data.request_jobs[_job_id].method;
            result_data.data.data_type = main_page.data.request_jobs[_job_id].data_type;
            result_data.data.send_data = main_page.data.request_jobs[_job_id].data;
            result_data.data.status = result_list.data.jobs_result[_job_id].status;
            result_data.data.response = result_list.data.jobs_result[_job_id].data;
            
            if (typeof(result_data.data.response) !== "string" 
                    && typeof(result_data.data.response) !== "number") {
                result_data.data.response = JSON.stringify(result_data.data.response);
            }
            
            this.$emit('push-page', result_data);
        },
    }
};