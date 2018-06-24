'use strict'
const getWxSignature = require('./getWxSignatureTest')

/**
 * Blued wx share相关的ticket获取
 * wxshare.js特供
 */
module.exports = function (router, logger) {
  router.get('/signature', function * () {
    let url = (this.header.referer || this.href).replace(/^http:/, 'https:').replace(/#.*$/, '')  // 将http修改为https & 删除#后的所有部分
    if (!url) {
      this.jsonp = {}
      return
    }
    let wxConfig = yield getWxSignature(url)

    this.jsonp = wxConfig
  })
}
