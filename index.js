import * as AllComponents from './src'
export * from './src'

const OPTIONS = {
  prefix: 'c',
  path:
  './Cesium/Cesium.js'
  // 'https://unpkg.com/cesium/Build/Cesium/Cesium.js' // default
//   accessToken: `Your accessToken`,
}

function plugin (Vue, options = OPTIONS) {
  // Vue.prototype.$cesium = Cesium // options

  Object.entries(AllComponents).forEach(([name, component]) => {
    const _name = `${options.prefix}${name}`
    Vue.component(_name, component)
  })
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
