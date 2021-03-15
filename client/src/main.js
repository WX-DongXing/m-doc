import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import './utils/X6'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/scss/element-variables.scss'

WebSocket.prototype.emit = function (event, message) {
  this.send(`${event}|${JSON.stringify(message)}`)
}

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
