
ipcMain.on('save_file', (event, _filename, _filters, _content) => {
    //var _filename = arg[0];
    //var content = arg[1];
    // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
    dialog.showSaveDialog({
        defaultPath: _filename,
        filters : JSON.parse(_filters)
    },(fileName) => {
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }

        // fileName is a string that contains the path and filename created in the save file dialog.  
        fs.writeFile(fileName, _content, 'base64');
    });
}); // ipcMain.on('save-file', (event, arg)=> {

ipcMain.on('open_window', (event, _link) => {
    shell.openExternal(_link);
});

ipcMain.on('retrieve_web', (event, _url, _method, _send_data, _callback_id) => {
    var _win = new BrowserWindow({show: false});
    var _load_url_setting = {
        //extraHeaders: 'Referer: http://www.google.com.twaaaaaa/'
    };
    
    _win.loadURL(_url, _load_url_setting);
    _win.webContents.once('did-finish-load', function () {
        _win.webContents.executeJavaScript('document.querySelector("html").innerHTML', true, result => {
            event.sender.send('asynchronous-reply', result);
        });
    });
});

/**
 * @deprecated 20180520 測試用
 */
if (false) {
    // document.querySelector("html").innerHTML;
ipcMain.on('open-second-window', (event, arg)=> {
    //dialog.showMessageBox({ type: 'info', buttons: ["OK"], message: JSON.stringify(arg)}
    //    , function (buttonIndex) {});
    //return "aaa";
    //mainWindow.webContents.ttt(arg);
    //event.returnValue = "aaa";
    
    var _win = new BrowserWindow({show: false});
    _win.loadURL(arg, {
        //extraHeaders: 'Referer: http://www.google.com.twaaaaaa/'
    });
    _win.webContents.once('did-finish-load', function () {
        //_win.show();
        
        /*
        _win.webContents.executeJavaScript('resp = function () {return "AAA"}', true, function (result) {
          //console.log(result) // 會是 fetch 執行結果的 JSON 物件
          event.sender.send('asynchronous-reply', result);
        })
        */
       _win.webContents.executeJavaScript('document.body.innerHTML', true, result => {
      console.log('callback result', result);
      event.sender.send('asynchronous-reply', result);
    });
        
    });
});

}   // if (false) {