import axios from 'axios'
import sha1 from 'sha1'
import merge from 'lodash/merge'
import uuid from 'uuid'
import qs from 'qs'
import envs from '../envs'
import {createNonceStr, createTimestamp} from './signature'
// import {mapKeysCameCaseToUnderlineCase, mapKeysUnderlineToCamelCase} from '../namingStyle'

const defaultConfig = {
  baseURL: envs.apiUrl,
  headers: {'Content-Type': 'application/json'},
  paramsSerializer: function (params) {
    return qs.stringify(params, {arrayFormat: 'repeat'})
  },
  // requestMapKeys: mapKeysCameCaseToUnderlineCase,
  // responseMapKeys: mapKeysUnderlineToCamelCase,
  errorCodeField: 'errCode',
  errorMsgField: 'errMsg',
}

export const createInstance = (config) => {
  config = merge({}, defaultConfig, config)
  const instance = axios.create(config)

// request
  instance.interceptors.request.use((config) => {
    const {requestMapKeys, data, loginSession} = config
    if (requestMapKeys) {
      config.data = data ? requestMapKeys(data) : data
    }

    if (loginSession) {
      const {id: sessionId, accessToken} = loginSession
      const nonce = createNonceStr()
      const timestamp = createTimestamp()

      const string = [accessToken, nonce, timestamp].sort().join('')
      const signature = sha1(string)

      config.headers = Object.assign({}, config.headers, {
        requestId: uuid().replace(/-/g, ''),
        sessionId,
        nonce,
        timestamp,
        signature
      })
      // config = merge(config, {headers: {Authorization: `Token ${config.token}`}})
    }

    return config
  }, (error) => {
    return Promise.reject(error)
  })

// response
  instance.interceptors.response.use((response) => {
    const {config: {responseMapKeys, errorCodeField}} = response
    let {data} = response

    if (responseMapKeys && data) {
      data = responseMapKeys(data)
    }

    if (data && data[errorCodeField] !== undefined) {
      return Promise.reject(data)
    }

    return data
  }, (error) => {
    const {config: {errorCodeField, errorMsgField}} = error
    if (error[errorCodeField] !== undefined) {
      return Promise.reject(error)
    }
    if (process.env.NODE_ENV !== 'production') {
      console.error(error)
    }
    return Promise.reject({
      [errorCodeField]: 500,
      [errorMsgField]: '服务器繁忙',
    })
  })

  instance.setLoginSession = (loginSession) => {
    instance.defaults.loginSession = loginSession
  }

  return instance
}

const instance = createInstance()

export default instance
