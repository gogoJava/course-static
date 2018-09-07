## request

发送请求

### 使用方法

```js
import {createInstance} from '@hjgy/common/src/request'

const instance = createInstance({
    // baseUrl: 默认为 envs.apiUrl
    // ...axios config
})

// axios methods
const res = instance.post(url,{username:'xxx',password:'xxxx'})

// 成功
console.log(res) // { list: [...], total: 100 }

// 异常，code为错误吗，message为错误信息
console.log(res) // { code: 500, message: '服务器繁忙' }

```
