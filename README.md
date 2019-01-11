# electron-loading-test
A client loading test webpage tool.

GitHub: https://github.com/pulipulichen/electron-loading-test
ISSUES: https://github.com/pulipulichen/electron-loading-test/issues

# 編譯檔成果下載
- Windows x64: https://drive.google.com/open?id=1w_fEdw5w5etIYKPDI4PcGn3tYEHipr9e
- Mobile APP: https://build.phonegap.com/apps/3170327/install 
- Mobile APP Homepage: https://build.phonegap.com/apps/3170327/share

# 安裝electron相關套件
* npm install electron-prebuilt --save-dev
* npm install electron-prebuilt -g
* npm install electron-packager --save-dev
* npm install electron-packager -g
* npm install asar
* npm install --save os-tmpdir

# 設定檔
請修改webapp-config.json設定檔，主要修改URL屬性

請務必確認JSON格式是否正確：使用JSONLint驗證 http://jsonlint.com/

ICON設定請以PNG格式、Base64編碼。使用BASE64 IMAGE轉換圖片格式：https://www.base64-image.de/

openDevTools決定是否預設開啟偵錯工具

其他參數請參照BrowserWindow的參數設定：
https://github.com/electron/electron/blob/master/docs/api/browser-window.md

* width、height (Integer)：設定高度與寬度
* useContentSize (Boolean)：根據內容的尺寸而調整視窗大小，很實用
* center (Boolean)：是否置中
* alwaysOnTop (Boolean)：是否永遠置頂
* skipTaskbar (Boolean)：是否不出現在工作列。如果做了這件事情，那就要搭配Tray來把App關閉才行。
* frame (Boolean)：是否無外框。無外框起來非常像現代的APP，很潮，但不一定好用。
* kiosk (Boolean)：全螢幕單視窗模式。想要限制使用者只能用這個視窗時可以使用，非常好用。
* transparent (Boolean)：背景是否透明，這樣可以跟其他視窗一起使用。

#快速鍵
* Escape：停止讀取或是離開APP
* F5：重新讀取
* Ctrl+Left：向後一頁
* Ctrl+Right：向前一頁
* Ctrl+Shift+i：切換偵錯工具

#編譯方法
1. 先開啟Node.js command prompt：在 開啟 > Node.js > Node.js command prompt
2. 切換到這個此目錄底下的bin
3. build1.bat
4. 切換回這個此目錄底下的bin
5. build2.bat

# 感謝
此程式碼的起點主要來自：QQBoxy-酷酷方盒子
http://qqboxy.blogspot.com/2016/06/electron-javascript-windows.html

# Reference
- Hourglass Icon http://www.iconninja.com/hourglass-time-timer-icon-5949
- https://gist.github.com/svagi/aa59e96e4b6a9885f28e Universal JSON dictionary of HTTP status codes. http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html 
- Privacy Policy Generator: https://www.freeprivacypolicy.com/
- Privacy Policy: https://pulipulichen.github.io/electron-loading-test/privacy-policy.html

# OnsenUI ICON
- fa https://fontawesome.com/icons?d=gallery
- ion http://ionicons.com/
- md http://zavoloklom.github.io/material-design-iconic-font/icons.html

# OnsenUI Vue API
- https://onsen.io/v2/api/vue/
- https://semantic-ui.com/kitchen-sink.html