// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import codeMirror from './components/sql-codemirror.vue'
// import router from './router'
import VueCodeMirror from 'vue-codemirror'


/* eslint-disable no-new */
Vue.use(VueCodeMirror)

new Vue({
  el: '#app',
  template: '<codeMirror/>',
  components: { codeMirror }
})
