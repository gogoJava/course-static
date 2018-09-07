// 生成随机数字符串
export const createNonceStr = () => {
  return Math.random().toString(36).substr(2, 15)
}

// 生成时间戳字符串
export const createTimestamp = () => {
  return parseInt(new Date().getTime() / 1000) + ''
}

// 进行字典排序
export const dictSort = function (args) {
  const values = Object.keys(args).map((key) => args[key])
  values.sort()

  return values.join('')
}

