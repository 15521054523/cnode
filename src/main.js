// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 插件
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
// 组件
import App from './App'
import Home from './components/home'
import Detail from './components/detail'
// css
import './assets/fonts/iconfont.css'
import './assets/sass/reset.css'
import 'mint-ui/lib/style.min.css'
import  './assets/sass/animate.min.css'

// 注册
Vue.use(VueRouter);
Vue.use(VueResource);

// 定义路由规则
const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/detail/:id',
        name: 'detail',
        component: Detail
    }
];

// 路由实例
const router = new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
});

// 定义全局过滤器
Vue.filter('getDateDiff', (value) => {
  if (!value) return;
  let result = '';
  let minute = 1000 * 60;     // 1分钟
  let hour = minute * 60;     // 1小时
  let day = hour * 24;        // 1天
  let month = day * 30;       // 1个月
  let year = month * 12;      // 1年
  let thisTimeMs = new Date().getTime();          // 获取当前时间的时间戳
  let articleTimeMs = new Date(value).getTime();  // 获取文章的时间戳
  let difference = thisTimeMs - articleTimeMs;    // 当前时间戳 - 文章的时间戳得出差值
  if (difference < 0) return;
  let minuteC = difference / minute;
  let hourC = difference / hour;
  let dayC = difference / day;
  let monthC = difference / month;
  let yearC = difference / year;
  if (yearC >= 1) {
      result = `${Math.round(yearC)}年前`;
  } else if (monthC >= 1) {
      result = `${Math.round(monthC)}个月前`;
  } else if (dayC >= 1) {
      result = `${Math.round(dayC)}天前`;
  } else if (hourC >= 1) {
      result = `${Math.round(hourC)}个小时前`;
  } else if (minuteC >= 1) {
      result = `${Math.round(minuteC)}分钟前`;
  } else {
    result = '刚刚';
  }
  return result;
});


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
