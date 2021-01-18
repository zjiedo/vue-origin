/***
 * 功能：
 * 负责编译末班，解析指令/差值表达式
 * 负责页面的首次渲染
 * 当数据变化后重新渲染视图
 * ****/

class Compiler {
    constructor (vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    // 编译末班，处理文本节点和元素节点
    compile (el) {
        let childNodes = el.childNodes

        Array.from(childNodes).forEach(node => {
            // 处理文本节点
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                // 处理元素节点
                this.compileElement(node)
            }
            // 判断node节点是否有子节点
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement (node) {
        // 遍历所有的属性节点
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2)
                let key = attr.value
                let eventType = ''
                if (attrName.startsWith('on:')) {
                    eventType = attrName.slice(3)
                    attrName = attrName.substr(0, 2)
                }
                this.update(node, key, attrName, eventType)
            }
        })
        // 判断是否是指令

    }
    update (node, key, attrName, eventType) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key, eventType)
    }
    // 处理v-text 指令
    textUpdater (node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    // 处理 v-on 指令
    onUpdater (node, value, key, eventType) {
        node.addEventListener(eventType, value.bind(this.vm))
        new Watcher(this.vm, key, newValue => {
            node.removeEventListener(eventType, value.bind(this.vm))
            node.addEventListener(eventType, newValue.bind(this.vm))
        })
    }
    // 处理v-html 指令
    htmlUpdater (node, value, key) {
        node.innerHTML = value
        new Watcher(this.vm, key, (newValue) => {
            node.innerHTML = newValue
        })
    }
    modelUpdater (node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    // 编译文本节点，处理差值表达式
    compileText (node){
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])


            // 创建watcher对象，当数据改变，更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }

    }
    // 判断元素属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-')
    }
    // 判断元素属性是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }
    // 判断节点时候是元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }
}