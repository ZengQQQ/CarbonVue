import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false }, // 添加元信息标记需要验证
    children:[      
    ]
  },
  {
    path: '/dataComparison',
    name: 'DataComparison',
    component: () => import('@/views/ComparePage.vue')
  },
  {
    path:'/other',
    name:'Other',
    component: () => import('@/views/Other.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


// 导航守卫
// router.beforeEach((to, from, next) => {
  // 假设有一个函数可以检查用户是否登录
  // const isAuthenticated = checkAuth();
  // // 检查路由是否需要认证
  // if (to.matched.some(record => record.meta.requiresAuth)) {
  //   if (!isAuthenticated) {
  //     // 用户未认证，重定向到登录页
  //     next({ name: 'Login' });
  //   } else {
  //     // 用户已认证，继续
  //     next();
  //   }
  // } else {
  //   // 路由不需要认证，直接继续
  //   next();
  // }
// });


function checkAuth() {
  // 这里应该有检查用户登录状态的逻辑
  // 例如检查本地存储、Cookies或Vuex状态
  // 返回布尔值表示用户是否登录
  return false;
}


export default router