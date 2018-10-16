
// 域名对应配置
const hostnameConfigMap = {

  /**
   * dev 环境
   */
  'localhost': {
    online: false,
    apiUrl: '//118.89.248.252:8089/', 
    // apiUrl: '//14.21.34.82:8088/',
  },

}

if (process.env.CLIENT_ENV === true) {
  module.exports = hostnameConfigMap[window.location.hostname]
} else {
  module.exports = hostnameConfigMap['localhost']
}
