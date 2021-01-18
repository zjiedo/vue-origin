let _Vue = null

export default class VueRouter {
    static install (Vue) { // vue的构造函数， 可选的选项
       /**
        * 1、判断当前插件是否已经被安装
        * 2、把vue的构造函数记录到全局变量
        * 3、把创建vue实例时传入的router对象，注入到所有的vue实例上
        * */ 
        //    1、判断当前插件是否已经被安装
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        // 2、把vue的构造函数记录到全局变量
        _Vue = Vue
        // 3、把创建vue实例时传入的router对象，注入到所有的vue实例上
        // 混入
        _Vue.mixin({
            beforeCreate () {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            }
        })
    }
    constructor (options) {
        this.options = options
        this.routeMap = {} // 路由规则 地址：组件
        this.data = _Vue.observable({
            current: '/'
        })// 响应式 存储当前路由
    }

    init () {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }

    createRouteMap () {
        // 遍历路由规则, 把路由规则解析成键值对的形式， 存储到 routerMap中  
        this.options.routes.forEach(route => {
            this.routeMap[route.path] =  route.component
        })
    }
    initComponents (Vue) {
        let self = this
        Vue.component('router-link', {
            props: {
                to: String
            },
            render (h) {
                return h('a', {
                    attrs: {
                        href: this.to,
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler (e) {
                    e.preventDefault()
                    // pushState改变地址栏
                    window.location.hash = '#' + this.to
                    this.$router.data.current = this.to
                }
            }
        })
        Vue.component('router-view', {
            render (h) {
                const component = self.routeMap[self.data.current]
                return h (component)
            }
        })
    }
    // 浏览器的后退前进时加载当前地址栏中的地址对应的组件
    initEvent () {
      window.addEventListener('load', this.hashChange.bind(this))
      window.addEventListener('hashchange', this.hashChange.bind(this))
    }
    hashChange () {
      if (!window.location.hash) {
        window.location.hash = '#/'
      }

      this.data.current = window.location.hash.substr(1)
    }
}