const express = require('express')
const { axiosGet
} = require('./utils')
const router = express.Router()

// 转发获取天气
router.get('/search', async (req, res) => {
  const { keyword } = req.query
  // console.log(res)
  try {
    const resObj = await axiosGet(`https://v0.yiketianqi.com/api?unescape=1&version=v91&appid=43656176&appsecret=I42og6Lm&ext=&cityid=&city=${keyword || ''}`)
    res.send(resObj.data)

  } catch (error) {
    res.send('网络不佳~')
  }

})
module.exports = router