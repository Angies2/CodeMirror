(function ($,CodeMirror) {
    var params = {
        mode:"application/json",
        indentUnit : 2,
        smartIndent : true,
        styleActiveLine: true,
        lineNumbers:true,
        lineWrapping:true,
        theme:"eclipse",
        lineWrapping:true,
        foldGutter: true,
        gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
        lint: true,
        matchBrackets:true,
        extraKeys:{
            "Alt-Space": "autocomplete",//ctrl-space唤起智能提示
            "F11": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function(cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            },
            "Ctrl-/": "toggleComment",
            "Ctrl-S": function (editor) {
                save(editor);
            },
            "Ctrl-Z":function (editor) {
                editor.undo();
            },//undo
            "F8":function (editor) {
                editor.redo();
            },//Redo
            "F7": function autoFormat(editor) {
                var totalLines = editor.lineCount();
                editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
            }//代码格式化
        }
    };
    CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.anyword});
    };
    function init(dom,params){
        var editor = CodeMirror.fromTextArea(dom, params);
        editor.setSize('100%','500px');
        return editor;
    }
    function save(editor){
        var ob = editor.getValue();  // 得到所有内容
        window.localStorage.setItem('jsonData', ob);
        alert(window.localStorage.getItem('jsonData'));
    }
    var util = {
        isObject: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Object]";
        }
    };
    $.fn.JsonE = function (options) {
        var opts = options && util.isObject(options) ? $.extend({}, params, options) : params;
        return init.call(null, this[0], opts);
    };
})(jQuery,CodeMirror);