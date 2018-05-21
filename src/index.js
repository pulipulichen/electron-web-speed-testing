const {app, BrowserWindow, dialog, Menu, Tray, globalShortcut, ipcMain, session, shell} = require('electron');
let fs = require('fs');
const osTmpdir = require('os-tmpdir');
let mainWindow;

function createWindow () {
    if (process.argv.length < 2) {
        dialog.showMessageBox({ type: 'info', buttons: buttons, message: "Lost Configuration JSON file Parameter" }
            , function (buttonIndex) {
                app.quit();
            });
        return;
    }

    var config_file = process.argv[1];
    if (fs.existsSync(config_file) === false) {
        dialog.showMessageBox({ type: 'info', buttons: ["OK"], message: "Cannot found file: \n" + config_file }
            , function (buttonIndex) {
                app.quit();
            });
        return;
    }

    var config = JSON.parse(fs.readFileSync(config_file, 'utf-8'));

    var url = config.URL;

    var icon_base64 = config.icon;
    icon_base64 = icon_base64.replace(/^data:image\/png;base64,/, "");
    var icon_path = osTmpdir() + "/webapp-wrapper-icon-" + url.replace(/[^A-Za-z]/g, "") + ".png";
    fs.writeFileSync(icon_path, icon_base64, 'base64');
    config.icon = icon_path;

    mainWindow = new BrowserWindow(config);
    //mainWindow.loadURL(url);
    mainWindow.$ = mainWindow.jQuery = require("./lib/jquery/jquery.min.js");
    mainWindow.loadURL('file://' + __dirname + '/loading-test/index.html');
    
    mainWindow.on('closed', function () {
        mainWindow = null;
        app.quit();
    });
    
    // Tray
    appIcon = new Tray(icon_path)
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Quit', type: 'radio', click: function () {
            app.quit();
        }}
    ]);
    contextMenu.items[(contextMenu.items.length-1)].checked = false;
    appIcon.setContextMenu(contextMenu);

    /*
    mainWindow.on('app-command', (e, cmd) => {
      // Navigate the window back when the user hits their mouse back button
       dialog.showMessageBox({ type: 'info', buttons: buttons, message: typeof(e) });
      if (cmd === 'browser-backward' && win.webContents.canGoBack()) {
        mainWindow.webContents.goBack()
      }
    })
*/

    if (config.openDevTools === true) {
        mainWindow.webContents.openDevTools();
    }

    // ------------------
    // Hotkey
    mainWindow.on('focus', function () {
        if (globalShortcut.isRegistered("Escape") === false) {
            globalShortcut.register('Escape', () => {
                if (config.kiosk === true) {
                    return;
                }

                if (mainWindow.webContents.isLoading()) {
                    mainWindow.webContents.stop();
                }
                else {
                    dialog.showMessageBox({ type: 'question', buttons: ["YES", "NO"], 
                        message: "Are you sure to exit?"},
                        function (buttonIndex) {
                            if (buttonIndex === 0) {
                                app.quit();
                            }
                        }
                     );
                }
            });

            globalShortcut.register('Ctrl+Shift+i', () => {
                mainWindow.webContents.toggleDevTools();
            });

            globalShortcut.register('Ctrl+Left', () => {
                mainWindow.webContents.goBack();
            });

            globalShortcut.register('Ctrl+Right', () => {
                mainWindow.webContents.goForward();
            });

            globalShortcut.register('F5', () => {
                mainWindow.webContents.reload();
            });

            if (config.kiosk === true) {
                // 似乎會失敗，應該要改用blur、focus的做法才是，但沒事還是不要亂做好了
                globalShortcut.register('Alt+Tab', () => {});
                globalShortcut.register('Ctrl+Alt+Delete', () => {});
            }
        }
        //dialog.showMessageBox({ type: 'info', buttons: buttons, message: typeof(1) });
    });

    mainWindow.on('blur', function () {
        globalShortcut.unregisterAll();
    });
    
    
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if(mainWindow === null) {
        createWindow();
    }
});

// ---------------------------------------------


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

ipcMain.on('retrieve_web', (event, _url, _method, _send_data, _referer, _callback_id) => {
    var _win = new BrowserWindow({show: false});
    var _load_url_setting = {
        extraHeaders: 'Referer: ' + _referer
    };
    
    if (_method === "post") {
        _load_url_setting["postData"] = [{
            type: 'rawData',
            bytes: Buffer.from(_send_data)
        }];
    }
    
    _win.loadURL(_url, _load_url_setting);
    _win.webContents.once('did-finish-load', function () {
        _win.webContents.executeJavaScript('document.querySelector("html").innerHTML', true, result => {
            event.sender.send(_callback_id, result, 200);
        });
    });
    
    _win.webContents.once('did-fail-load', function () {
        event.sender.send(_callback_id, "", "Load failed.");
    });
});

ipcMain.on('set_item', (event, _key, _item) => {
    var _file_name = __dirname + "/cache/local_storage_" + _key + ".json";
    fs.writeFile(_file_name, _item, "utf8");
});

ipcMain.on('get_item', (event, _key, _callback_id) => {
    var _file_name = __dirname + "/cache/local_storage_" + _key + ".json";
    fs.exists(_file_name, function (_is_exists) {
        if (_is_exists === true) {
            fs.readFile(_file_name, "utf8", function (_err, _value) {
                event.sender.send(_callback_id, _value);
            });
        }
        else {
            event.sender.send(_callback_id, null);
        }
    });
});