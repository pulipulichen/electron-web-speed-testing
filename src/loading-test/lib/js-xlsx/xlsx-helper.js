
var xlsx_helper_download = function (type, filename, data) {
    //var elt = document.getElementById('data-table');
    //var wb = XLSX.utils.table_to_book(elt, {sheet: "Sheet JS"});
    
    var wb = XLSX.utils.book_new();
    if (Array.isArray(data)) {
        var ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "data");
    }
    else {
        for (var _sheet_name in data) {
            var _sheet_data = data[_sheet_name];
            if (Array.isArray(_sheet_data) === false) {
                var _tmp = [];
                for (var _field_name in _sheet_data) {
                    var _field_value = _sheet_data[_field_name];
                    _tmp.push({
                        'key': _field_name,
                        'value': _field_value
                    });
                }
                _sheet_data = _tmp;
            }
            
            var ws = XLSX.utils.json_to_sheet(_sheet_data);
            XLSX.utils.book_append_sheet(wb, ws, _sheet_name);
        }
    }
    
    // --------------------------------------
    
    if (filename.substr(filename.length-type.length-1, type.length+1) !== "." + type) {
        filename = filename + "." + type;
    }
    
    //XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'})
    XLSX.writeFile(wb, filename || ('test.' + (type || 'xlsx')));
};


var process_wb = (function() {
	var OUT = document.getElementById('out');
	var HTMLOUT = document.getElementById('htmlout');

	var get_format = (function() {
		var radios = document.getElementsByName( "format" );
		return function() {
			for(var i = 0; i < radios.length; ++i) if(radios[i].checked || radios.length === 1) return radios[i].value;
		};
	})();

	var to_json = function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result[sheetName] = roa;
		});
		return JSON.stringify(result, 2, 2);
	};

	var to_csv = function to_csv(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
			if(csv.length){
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(csv);
			}
		});
		return result.join("\n");
	};

	var to_fmla = function to_fmla(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
			if(formulae.length){
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(formulae.join("\n"));
			}
		});
		return result.join("\n");
	};

	var to_html = function to_html(workbook) {
		HTMLOUT.innerHTML = "";
		workbook.SheetNames.forEach(function(sheetName) {
			var htmlstr = XLSX.write(workbook, {sheet:sheetName, type:'string', bookType:'html'});
			HTMLOUT.innerHTML += htmlstr;
		});
		return "";
	};

	return function process_wb(wb, _callback) {
		global_wb = wb;
		var output = "";
                output = to_json(wb);
                //console.log(output);
                _callback(output);
	};
})();

var XW = {
	/* worker message */
	msg: 'xlsx',
	/* worker scripts */
	worker: './lib/js-xlsx/xlsxworker.js'
};

var do_file = (function() {
    var rABS = true;
                var use_worker = true;
	var xw = function xw(data, cb) {
		var worker = new Worker(XW.worker);
		worker.onmessage = function(e) {
			switch(e.data.t) {
				case 'ready': break;
				case 'e': console.error(e.data.d); break;
				case XW.msg: cb(JSON.parse(e.data.d)); break;
			}
		};
		worker.postMessage({d:data,b:rABS?'binary':'array'});
	};

	return function do_file(files, _callback) {
		var rABS = true;
                var use_worker = true;
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
			var data = e.target.result;
			if(!rABS) data = new Uint8Array(data);
			if(use_worker) xw(data, process_wb);
			else {
                            process_wb(XLSX.read(data, {type: rABS ? 'binary' : 'array'}), _callback);
                        };
		};
		if(rABS) reader.readAsBinaryString(f);
		else reader.readAsArrayBuffer(f);
	};
})();

var xlsx_helper_open = function (_callback) {
    $("#xlsx_helper_open_file").remove();
    var _input = $('<input type="file" name="xlfile" id="xlsx_helper_open_file" />').hide().appendTo('body');
    _input.change(function (e) {
         do_file(e.target.files, function (_json) {
             console.log(_json);
             console.log("aaa");
             // 要再做處理
             
             var _result = {};
             for (var _sheet_name in _json) {
                 var _sheet_data = _json[_sheet_name];
                 var _data;
                 if (_sheet_data[0][0] === 'key' && _sheet_data[0][1] === 'value' && _sheet_data[0].length === 2) {
                     // key-value模式
                     _data = {};
                     for (var _i = 1; _i < _sheet_data.length; _i++) {
                         var _row = _sheet_data[_i];
                         _data[_row[0]] = _row[1];
                     }
                 }
                 else {
                     // 陣列模式
                     _data = [];
                     var _key_dict = _sheet_data[0];
                     for (var _i = 1; _i < _sheet_data.length; _i++) {
                         var _row = _sheet_data[_i];
                         var _d = {};
                         for (var _j = 0; _j < _row.length; _j++) {
                             var _key = _key_dict[_j];
                             _d[_key] = _row[_j];
                         }
                         _data.push(_d);
                     }
                 }
                 _json[_sheet_name] = _data;
             }
             _callback(_json);
         });
    });
    _input.click();
};

/*
setTimeout(function () {
    //var data = [{name:"Sheet", age: 12}, {name:"JS", age: 24}]
    var data = {
        "s0": {"a": 1, "b": 2},
        "s1": [{name:"Sheet", age: 12}, {name:"JS", age: 24}],
        "s2": [{name:"Sheet", age: 12}, {name:"JS", age: 24}]
    };
    
    xlsx_helper_download('ods', 'ok', data);
}, 10);
*/