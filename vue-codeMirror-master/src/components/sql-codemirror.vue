<template>
  <codemirror v-model="code" ref="myEditor" :options="editorOptions"></codemirror>
</template>

<script>
  import {codemirror,CodeMirror} from 'vue-codemirror'
  require('codemirror/theme/my-edit.css');
  require('codemirror/addon/hint/show-hint.css');
  require('codemirror/addon/scroll/simplescrollbars.css');
  require('codemirror/addon/display/fullscreen.css');
  require('codemirror/addon/fold/foldgutter.css');
  require('codemirror/addon/hint/show-hint.js');
  require('codemirror/addon/hint/sql-hint.js');
  require('codemirror/addon/selection/active-line.js');
  require('codemirror/addon/edit/matchbrackets.js');
  require('codemirror/addon/display/fullscreen.js');
  require('codemirror/addon/scroll/simplescrollbars.js');
  require('codemirror/addon/comment/comment.js');
  require('codemirror/addon/display/placeholder.js');
  require('codemirror/addon/fold/foldcode.js');
  require('codemirror/addon/fold/foldgutter.js');
  require('codemirror/addon/fold/brace-fold.js');
  require('codemirror/addon/fold/comment-fold.js');
  require('codemirror/addon/formatting/formatting.js');

  export default {
    data () {
      return {
        code: '',
        editorOptions: {
          mode: 'text/x-mysql',
          indentWithTabs: true,
          smartIndent: true,
          indentUnit:3,
          lineNumbers: true,
          matchBrackets: true,
          theme:'my-edit',
          placeholder:'your code is here...',
          styleSelectedText: true,
          scrollbarStyle: 'simple',
          coverGutterNextToScrollbar:true,
          autofocus:true,
          lineWrapping:true,
          styleActiveLine: true, // 当前行背景高亮
          foldGutter: true,
          gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          hintOptions: {
            tables: {
              "table1": [ "col_A", "col_B", "col_C" ],
              "table2": [ "other_columns1", "other_columns2" ]
            }
          }
        }
      }
    },
    methods:{
      bindKeyMaps: function (editor) {
        editor.setOption("extraKeys", {
          "'a'": this.completeAfter,
          "'b'": this.completeAfter,
          "'c'": this.completeAfter,
          "'d'": this.completeAfter,
          "'e'": this.completeAfter,
          "'f'": this.completeAfter,
          "'g'": this.completeAfter,
          "'h'": this.completeAfter,
          "'i'": this.completeAfter,
          "'j'": this.completeAfter,
          "'k'": this.completeAfter,
          "'l'": this.completeAfter,
          "'m'": this.completeAfter,
          "'n'": this.completeAfter,
          "'o'": this.completeAfter,
          "'p'": this.completeAfter,
          "'q'": this.completeAfter,
          "'r'": this.completeAfter,
          "'s'": this.completeAfter,
          "'t'": this.completeAfter,
          "'u'": this.completeAfter,
          "'v'": this.completeAfter,
          "'w'": this.completeAfter,
          "'x'": this.completeAfter,
          "'y'": this.completeAfter,
          "'z'": this.completeAfter,
          "'.'": this.completeAfter,
          "'='": this.completeIfInTag,
          // F11键切换全屏
          "Ctrl-F11": this.fullScreen,
          // Esc键退出全屏
          "Esc": this.escFullScreen,
          "Ctrl-/": editor => {
            editor.toggleComment();
          },
          "Ctrl-S":this.save,
          "Ctrl-F10": editor => {
            this.autoFormat(editor);
          }
        });
      },
      completeAfter: function (editor, pred) {
        if (!pred || pred()){
          setTimeout(function() {
            if (!editor.state.completionActive)
              editor.showHint({
                completeSingle: false
              });
          }, 100);
        }
        return CodeMirror.Pass;//不对按键进行处理
      },
      completeIfInTag: function (editor) {
        return this.completeAfter(editor, function() {
          var tok = editor.getTokenAt(editor.getCursor());
          if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
          var inner = CodeMirror.innerMode(editor.getMode(), tok.state).state;
          return inner.tagName;
        });
      },
      autoFormat: function (editor) {
        var range = this.getSelectedRange(editor);
        editor.autoFormatRange(range.from, range.to);
      },
      getSelectedRange:  function (editor) {
        return { from: editor.getCursor(true), to: editor.getCursor(false) };
      },
      fullScreen: function (editor) {
        editor.setOption("fullScreen", !editor.getOption("fullScreen"));
      },
      escFullScreen: function (editor) {
        if (editor.getOption("fullScreen")) editor.setOption("fullScreen", false);
      },
      save:  function () {
        var value = this.code;
        window.localStorage.setItem('sqlEditSave', value);
      },
      sqlAddKeyWords:function (mode, str) {
        var strArray = [],
          mimeModesOrig = null;
        if(arguments.length == 0) return;
        if(arguments.length > 1) {
          if(!!mode && typeof mode === 'string'&& CodeMirror.mimeModes[mode] != null && typeof CodeMirror.mimeModes[mode] === 'object') {
            mimeModesOrig = CodeMirror.mimeModes[mode]
          } else {
            mimeModesOrig = CodeMirror.mimeModes;
            console.error("Model does not exist or is illegal!!");
          }
        } else {
          str = mode;
          mode = null;
          mimeModesOrig = CodeMirror.mimeModes;
        }
        if(!str || str == '' || str == [] || str == {}) return;
        if(typeof str === "string") {
          strArray = str.split(" ");
          addAttr(mimeModesOrig);
        }else{
          console.error('Parameter type error!!')
        }
        function  addAttr(object) {
          for(var item in object) {
            if(object[item] != null && typeof object[item] == 'object') {
              if(item == 'keywords') {
                for(var i = 0;i <= strArray.length;i++) {
                  if(!object['keywords'][strArray[i]]) {
                    object['keywords'][strArray[i]] = true;
                  }else {
                    return;
                  }
                }
              }else {
                addAttr(object[item]);
              }
            }
          }
        }
      }
    },
    computed: {
      editor() {
        return this.$refs.myEditor.editor
      }
    },
    mounted() {
      this.bindKeyMaps(this.editor);
      this.editor.setValue( window.localStorage.getItem('sqlEditSave'));
      CodeMirror.defineExtension('sqlAddKeyWords', this.sqlAddKeyWords);
      this.editor.sqlAddKeyWords('text/x-mysql','saas bass');
    },
    components: {
      codemirror
    }
  }
</script>

