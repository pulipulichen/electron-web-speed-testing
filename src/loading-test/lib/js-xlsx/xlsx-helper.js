
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

var xlsx_helper_open = function (_callback) {
    
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