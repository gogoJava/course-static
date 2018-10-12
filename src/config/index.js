import merge from 'lodash/merge'

const config = require('./config')
const defaultConfig = require('./defaultConfig')

export default merge({}, defaultConfig, config)
