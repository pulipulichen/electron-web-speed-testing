vue_create_event = function () {
    document.title = i18n.t("LOADING TEST");
    
    // ------------------
    // 以下是測試
    
    setTimeout(function () {
        //vm.status_total_job = 10;
        //vm.start_test();
        //main_page.methods.start_test();
        //main_page.methods.nav_about();
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
       
       //$.get("http://localhost/nodejs-projects/electron-loading-test/[test]/relative.html", function (_result) {
       //    document.getElementById('test').contentWindow.document.write(_result);
       //});
       //document.getElementById('test').contentWindow.document.write('  <div id="board"> Work! </div>  <style type="text/css"> @import "compass/css3";  * {   box-sizing:border-box;   padding:0;   margin:0; }  html {     height:100%;  }  body {     background:linear-gradient(#adf1ff, #fff);    height:100%;  }  #board {   position:relative;   width:200px;   height:150px;   margin:40px auto;   background:linear-gradient(#616161, #474747);   border:1px solid #9f7037;   box-shadow:     inset 0 0 2px 2px rgba(0,0,0,0.3),     inset 0 30px 30px rgba(255,255,255,0.1);   text-align:center;   color:white;   font-weight:bold;   font-size:40px;   font-family:\'Monospace\';   letter-spacing:3px;   text-shadow:0 1px 0 rgba(0,0,0,0.3);   line-height:150px;   border-radius:3px; }  #board:before {   content:"";   position:absolute;   left:-10px;   right:-10px;   top:-10px;   bottom:-10px;   background:#e8cca0;   z-index:-1;   border-radius:0.3em;   border:#9b6b2f solid 1px;   box-shadow:     0 4px 2px 2px rgba(0,0,0,0.2),     inset 0 1px 0 rgba(255,255,255,0.4),     inset 0 0 2px rgba(0,0,0,1); }  #board:after {   content:"";   display:block;   position:absolute;   border-radius:0.1em 0.1em 0 0.1em;   width:50px;   height:8px;   background:#f1f1f1;   bottom:-1px;   right:15px;   box-shadow:     inset 0 -4px 1px rgba(0,0,0,0.3),     -1px -1px 1px rgba(0,0,0,0.2),     0 2px 0 rgba(0,0,0,0.3); } </style> ');
       
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

/*
const {ipcRenderer} = require('electron');

//ipcRenderer.send('open-second-window', "http://localhost/nodejs-projects/electron-loading-test/[test]/referer.php")
ipcRenderer.send('save-file', "test.txt", "https://stackoverflow.com/questions/4149890/how-get-iframe-body-after-load")
*/