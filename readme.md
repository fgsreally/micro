微前端相关，目前仅修正了路由共存和懒加载，仅尝试过vue-cli


```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import {
  registerMicroApps,
  start
} from '../../../dist'

import store from './store'

Vue.config.productionTip = false
let app = new Vue({
  router,
  store,
  render: h => h(App)
})
app.$mount('#app')

if (window.window.__CURRENT_PROXY__) {

}
window.vuex = app.$store

const appList = [{
  name: 'vue',
  activeRule: '/about',
  container: '#micro-container',
  entry: 'http://localhost:8080',
}, ]

registerMicroApps(appList)
start()
```