import merge from 'lodash/merge'

const config = require('./config')
const defaultConfig = require('./defaultConfig')
console.log('defaultConfig', defaultConfig)

export default merge({}, defaultConfig, config)
