const hostname = window.location.hostname

const hostnameEnv = process.env.HOSTNAME_ENV || {}

export default Object.assign({}, hostnameEnv.default, hostnameEnv[hostname])
