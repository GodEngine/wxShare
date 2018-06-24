 /* eslint-disable */
const urllib = require('urllib')
const JsSHA = require('jssha')
// 调用微信的SDK
const appInfo = {
  appID: '',
  appsecret: ''
}

const cacheInfo = {}

// 时间戳
const timeStamp = () => parseInt(new Date().getTime() / 1000)

// 签名
const sign = (ticket, noncestr, timestamp, url) => {
  const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
  const shaObj = new JsSHA(str, 'TEXT')

  return shaObj.getHash('SHA-1', 'HEX')
}

function * getTicket (accessToken) {
  try {
    let result = yield urllib.request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`, {
      dataType: 'json',
      timeout: 2000
    })

    if (Number(result.status) !== 200) {
      return null
    }

    return result.data.ticket
  } catch (e) {
    console.error('https://api.weixin.qq.com/cgi-bin/ticket/getticket:', e.message)
    return null
  }
}
// 获取token
module.exports = function * (url) {
  url = url.replace('https', 'http')
  let ticket

  try {
    // 如果第一次启动，或者该ticket已经存在了超过7200秒，则重新获取ticket
    if (!cacheInfo.startTime || !cacheInfo.ticket || ((timeStamp() - 7200) > cacheInfo.startTime)) {
      console.log('通过wxAPI获取token', timeStamp(), cacheInfo.startTime, url)
      let result = yield urllib.request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appInfo.appID}&secret=${appInfo.appsecret}`, {
        dataType: 'json',
        timeout: 2000
      })

      if (Number(result.status) !== 200) {
        return null
      }
      let ticketInfo = yield getTicket(result.data.access_token)

      if (!ticketInfo) {
        return null
      }

      cacheInfo.startTime = timeStamp()
      ticket = cacheInfo.ticket = ticketInfo
    } else {
      ticket = cacheInfo.ticket
    }

    let nonceStr = Math.random().toString(36).substr(2, 15)
    let timestamp = timeStamp()
    let signature = sign(ticket, nonceStr, timestamp, url)
    return { ticket, nonceStr, timestamp, url, signature, appId: appInfo.appID }
  } catch (e) {
    console.error('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential', e.message)
    return {
      code: 500,
      msg: e.message
    }
  }
}
