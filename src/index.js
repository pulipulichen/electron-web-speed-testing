const {app, BrowserWindow, dialog, Menu, Tray, globalShortcut} = require('electron');
let fs = require('fs');
const osTmpdir = require('os-tmpdir');
let mainWindow;

function createWindow () {
    var buttons = ['OK'];
    if (process.argv.length < 2) {
        dialog.showMessageBox({ type: 'info', buttons: buttons, message: "Lost Configuration JSON file Parameter" }
            , function (buttonIndex) {
                app.quit();
            });
        return;
    }

    var config_file = process.argv[1];
    if (fs.existsSync(config_file) === false) {
        dialog.showMessageBox({ type: 'info', buttons: buttons, message: "Cannot found file: \n" + config_file }
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
    mainWindow.loadURL('file://' + __dirname + '/loading-test/index.html');
    
    mainWindow.on('closed', function () {
        mainWindow = null;
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
    
    mainWindow.on('custom_func', function () {
        app.quit();
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