vue_create_event = function () {
    document.title = i18n.t("LOADING TEST");
    
    // ------------------
    // 以下是測試
    
    setTimeout(function () {
        //vm.status_total_job = 10;
        //vm.job_run();
        main_page.methods.job_run();
    }, 1000);

    setTimeout(function () {
        //var _url = "https://stackoverflow.com/questions/4149890/how-get-iframe-body-after-load";
        //var _url = "http://web.mit.edu/yenjie/www/lm/physics/title.htm";
        //var _url = "http://localhost/nodejs-projects/electron-loading-test/[test]/referer.php";
        //location.href = "http://localhost/";
        
        //Object.defineProperty(document, "referrer", {get : function(){ return "http://localhost/"; }});
        /*
        delete window.document.referrer;
        window.document.__defineGetter__('referrer', function () {
            return "http://localhost/";
        });
        
        $('<iframe src="' + _url + '" sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts"></iframe>').load(function () {
            console.log("ok");
            // document.getElementById('frame').contentDocument.body
            //alert($(this.contentDocument.body).html());
        }).appendTo($("#panel_configuration"));
        */
       /*
       $.ajax(_url, {
           'beforeSend': function(xhr) {xhr.setRequestHeader("referer", "http://www.google.com.tw/")}
       });
        */
       
    }, 1000);
        
};

/*
const {ipcRenderer} = require('electron')

//ipcRenderer.send('open-second-window', "http://localhost/nodejs-projects/electron-loading-test/[test]/referer.php")
ipcRenderer.send('open-second-window', "https://stackoverflow.com/questions/4149890/how-get-iframe-body-after-load")
ipcRenderer.on('asynchronous-reply', function (event, result){
    console.log("r1 " + result);
});
*/

/*
r1 = ipcRenderer;
r2 = ipcRenderer;
r1.send('open-second-window', "aa");
r1.on('asynchronous-reply', function (event, result){
    console.log("r1 " + result);
});

r2.send('open-second-window', "aaccc");
r2.on('asynchronous-reply', function (event, result){
    console.log("r2 " + result);
});
*/