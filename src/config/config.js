
// 域名对应配置
const hostnameConfigMap = {

  /**
   * dev 环境
   */
  'localhost': {
    online: false,
    apiUrl: '//47.75.101.54:8089/',
  },

}

if (process.env.CLIENT_ENV === true) {
  module.exports = hostnameConfigMap[window.location.hostname]
} else {
  module.exports = hostnameConfigMap['localhost']
}

