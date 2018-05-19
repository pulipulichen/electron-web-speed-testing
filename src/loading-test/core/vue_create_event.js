vue_create_event = function () {
    document.title = i18n.t("LOADING TEST");
    
    // ------------------
    // 以下是測試
    
    /*
    setTimeout(function () {
        vm.status_total_job = 10;
        //vm.job_run();
    }, 1000);
    */

    setTimeout(function () {
        var _url = "https://stackoverflow.com/questions/4149890/how-get-iframe-body-after-load";
        //var _url = "http://web.mit.edu/yenjie/www/lm/physics/title.htm";
        $('<iframe src="' + _url + '"></iframe>').load(function () {
            console.log("ok");
            // document.getElementById('frame').contentDocument.body
            //alert($(this.contentDocument.body).html());
        }).appendTo($("#panel_configuration"));
    }, 1000);
        
};
