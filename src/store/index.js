import Vue from 'vue'
import {Store, install} from 'vuex'
// plugins
import plugins from './plugins'
// modules
import modules from './modules'

// 重要，告诉 Vue 组件如何处理 Vuex 相关的配置
install(Vue)

const store = new Store({
  plugins,
  modules,
  /**
   * 要开启严格模式，只需要在创建 Vuex store 实例时传入 strict: true
   * 在严格模式中，每当 Vuex state 在 mutation handlers 外部被改变时都会抛出错误。
   * 不要在生产环境中开启严格模式！ 为了检测在不合适的地方发生的状态修改, 严格模式会对 state 树进行一个深观察 (deep watch)。
   * 所以为了避免不必要的性能损耗，请在生产环境中关闭严格模式。
   */
  strict: process.env.NODE_ENV !== 'production'
})

if (module.hot) {
  // 使 modules 成为可热重载模块
  module.hot.accept([
    './modules',
  ], () => {
    // 获取更新后的模块
    // 因为 babel 6 的模块编译格式问题，这里需要加上 .default
    // 加载新模块
    store.hotUpdate({
      modules: require('./modules').default
    })
  })
}

export function registerModule(path, module, options) {
  options = {...options}
  if (typeof path === 'string') {
    path = [path]
  }
  // 对应的state为空时
  let state = store.state
  let isRegister = path.every(item => {
    if (!state[item]) {
      return false
    }
    state = state[item]
    return true
  })
  if (!isRegister) {
    options.preserveState = false
  }

  module = removeDuplicate(path, module)

  store.registerModule(path, module, {
    preserveState: true,
    ...options
  })
}

function removeDuplicate(path, module) {
  // 重复getters
  if (module.getters) {
    Object.keys(module.getters).forEach(getter => {
      const storeGetter = module.namespaced ? [...path, getter].join('/') : getter

      if (storeGetter in store.getters) {
        const getters = {...module.getters}
        delete getters[getter]

        module = {
          ...module,
          getters
        }
      }
    })
  }
  // 重复actions
  if (module.actions) {
    Object.keys(module.actions).forEach(action => {
      const storeAction = module.namespaced ? [...path, action].join('/') : action

      if (storeAction in store._actions) {
        const actions = {...module.actions}
        delete actions[action]

        module = {
          ...module,
          actions
        }
      }
    })
  }

  const {modules} = module
  if (modules) {
    Object.keys(modules).forEach(name => {
      const childrenModule = modules[name]

      module = {
        ...module,
        modules: {
          ...module.modules,
          [name]: removeDuplicate([...path, name], childrenModule)
        }
      }
    })
  }

  return module
}

export default store
