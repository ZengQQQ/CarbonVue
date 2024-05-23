// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// import { createPinia } from 'pinia';
// import { createPersistedState } from 'pinia-persistedstate-plugin';
// 创建 Vue 应用实例
const app = createApp(App);


// 使用 ElementPlus UI 框架
app.use(ElementPlus);

// 使用 Vue Router
app.use(router);

// 使用 Pinia
// const pinia = createPinia();
// pinia.use(createPersistedState());
// app.use(pinia);

// 将 Vue 应用挂载到 DOM 中的 '#app' 元素上
app.mount('#app');