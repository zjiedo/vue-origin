import Vue from 'vue'
import VueRouter from '../vue-router'
import Home from '../components/Home';
import Foo from '../components/Foo';
import Bar from '../components/Bar';

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [{
    path: '/',
    component: Home
  },{
    path: '/foo',
    component: Foo
  },{
    path: '/bar',
    component: Bar
  }]
})

export default router