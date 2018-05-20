var jsono = [{//测试数据
        "eng1": "adventLifecycle",
        "eng2": "title",
        "eng3": "defaultPrice",
    }];

var jsono_chi = [{//测试数据
        "eng1": "adventLifecycle",
        "eng2": "title",
        "eng3": "defaultPrice",
        "高(cm)": "height",
        "商品描述": "Description",
        "保质期禁售(天)": "lockupLifecycle",
        "商品名称": "skuName",
    }];

/**
 * https://www.jianshu.com/p/74d405940305
 * @type type
 */
xlsx_helper = {
    tmpDown: null, //导出的二进制对象
    download: function (filename, json, type) {
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        //keyMap =Object.keys(json[0]);
        for (var k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
        var tmpdata = [];//用来保存转换好的json 
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                    v: v[k],
                    position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
                }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
                v: v.v
            });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        var tmpWB = {
            SheetNames: ['data'], //保存的表标题
            Sheets: {
                'data': Object.assign({},
                        tmpdata, //内容
                        {
                            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                        })
            }
        };
        
        /* bookType can be any supported output type */
var wopts = { bookType:'ods', bookSST:false, type:'binary' };

var wbout = XLSX.write(tmpWB,wopts);
//wbout = this.s2ab(wbout);

/* the saveAs call downloads a file on the local machine */
saveAs(new Blob([wbout],{type:"application/vnd.oasis.opendocument.spreadsheet"}), "test.ods");
return;
        
        
        
        var _xlsx_write = XLSX.write(tmpWB,{
                            bookType: (type === undefined ? 'xlsx' : type), 
                            bookSST: false, 
                            type: 'binary'
                    });//这里的数据是用来定义导出的格式类型
        _xlsx_write = this.s2ab(_xlsx_write);
        tmpDown = new Blob([_xlsx_write], {
            type: "application/octet-stream"
        }); //创建二进制对象写入转换好的字节流
        
        // ---------------------------------------
        // 準備儲存
        
        var href = URL.createObjectURL(tmpDown); //创建对象超链接
        $("#js_xlsx_downloader").remove();
        var _a = $('<a download="' + filename + '" id="js_xlsx_downloader">AAAAA</a>').appendTo('body');
        _a.attr('href', href);
        //document.getElementById("hf").href = href; //绑定a标签
        document.getElementById("js_xlsx_downloader").click(); //模拟点击实现下载
        setTimeout(function () { //延时释放
            URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
            //_a.remove();
        }, 100);
    },
    getCharCol: function (n) {
        let temCol = '',
                s = '',
                m = 0;
        while (n > 0) {
            m = n % 26 + 1;
            s = String.fromCharCode(m + 64) + s;
            n = (n - m) / 26;
        }
        return s;
    },
    s2ab: function (s) { //字符串转字符流
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }
};

$(function () {
    xlsx_helper.download("檔案名稱.ods", jsono, 'ods');
});
