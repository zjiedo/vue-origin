class Observer {
  constructor (data) {
    this.walk(data)
  }
  walk (data) {
    // 判断data是否是对象
    if (!data || typeof data!== 'object') return
    // 遍历对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive (obj, key, val) {
    // 如果val是对象，会把内部也转换成响应式数据
    this.walk(val)
    let _this = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newValue) {
        if (newValue === val) return
        val = newValue
        _this.walk(newValue)
        // 发送通知

        dep.notify()
      }
    })
  }
}