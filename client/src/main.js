import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import './utils/X6'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/scss/element-variables.scss'
import 'github-markdown-css/github-markdown.css'

WebSocket.prototype.emit = function (event, message) {
  if (event !== 'PARSE_MARKDOWN') {
    this.send(`${event}|${JSON.stringify(message)}`)
  } else {
    this.send(`${event}|${message}`)
  }
}

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
