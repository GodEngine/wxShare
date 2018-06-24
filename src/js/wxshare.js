let inWechat = window.inWechat = (/micromessenger/i.test(navigator.userAgent));
if (inWechat) {
  window.WXShareConfig = {
    title: '', // 分享标题
    desc: '', // 分享描述
    imgUrl: '' // 分享图标
  }
window.addEventListener('load', function () {
  if (!window.WXShareConfig) {
    return
  }

  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let config = JSON.parse(this.responseText)
      wxInit(config)
    }
  }
  xhttp.open('GET', '/wx/signature', true)
  xhttp.send()

  function wxInit ({
    url: link = '',
    nonceStr,
    timestamp,
    signature,
    appId
  }) {
    let {
      debug = false,  // 是否开启debug模式
      jsApiList = ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone'], // 需要使用的JS接口列表 ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone']
      title = 'Blued分享', // 分享的标题
      desc = 'Blued分享', // 分享的文案描述
      imgUrl = 'https://dn-web-blued-cn.qbox.me/web/static/live/share-logo-28c6daf4.png', // 分享的icon
      type = '', // 分享类型,music、video或link，不填默认为link
      dataUrl = '' // 如果type是music或video，则要提供数据链接，默认为空
    } = window.WXShareConfig
    wx.config({
      debug,
      appId,
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见附录1
      jsApiList  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })

    wx.ready(function () {
      wx.onMenuShareAppMessage({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl, // 分享图标
        type, // 分享类型,music、video或link，不填默认为link
        dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
      })
      wx.onMenuShareTimeline({
        title,
        link,
        imgUrl,
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
      })
      wx.onMenuShareQQ({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接
        imgUrl, // 分享图标
        success: function () {
           // 用户确认分享后执行的回调函数
        },
        cancel: function () {
           // 用户取消分享后执行的回调函数
        }
      })
      wx.onMenuShareQZone({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接
        imgUrl, // 分享图标
        success: function () {
           // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
      })
    })
  }
})

}
