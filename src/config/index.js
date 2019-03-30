import merge from 'lodash/merge'

// const config = require('./config')
// const defaultConfig = require('./defaultConfig')
// console.log('defaultConfig', defaultConfig)
const defaultConfig = {
  online: false,
  // apiUrl: '//lolcainiao.club/basics/',
  apiUrl: '//ccjkjy.com/basics/',
  // apiUrl: '//wumingnv.vip:8080/basics/',
}

export default merge({}, defaultConfig)
