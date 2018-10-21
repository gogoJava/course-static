
// 域名对应配置
const hostnameConfigMap = {

  /**
   * dev 环境
   */
  'localhost': {
    online: false,
    // apiUrl: '//118.89.248.252:8089/',
    apiUrl: '//ccjkjy.com/basics/',
  },

}

if (process.env.CLIENT_ENV === true) {
  module.exports = hostnameConfigMap[window.location.hostname]
} else {
  module.exports = hostnameConfigMap['localhost']
}
