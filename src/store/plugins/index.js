// 开发环境和生产环境也需要的中间件
const plugins = []

if (process.env.NODE_ENV !== 'production') {
  // 开发环境中间件
  plugins.push(require('./logger').default)
}

export default plugins
