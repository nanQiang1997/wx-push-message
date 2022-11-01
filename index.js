const express = require('express')
const sha1 = require('sha1');//引入sha1
const { axiosPost,
  axiosGet,
  getToken } = require('./utils')
const router = require('./router')
const app = express()

app.use(express.static('./static')).use(router)
app.get('/user', (req, res) => {
  console.log(req.query)
  // console.log(res)
  res.send({
    "data": {
      "payUrl": null,
      "payType": 6,
      "payMoney": 23,
      "tokenId": null,
      "payInfo": "{\"appId\":\"wx5d4f86e430957eea\",\"timeStamp\":\"1667027876\",\"nonceStr\":\"67d54bff30e845bcb7f01b21aa064fc8\",\"package\":\"prepay_id=wx29151756545985291a5946e26b04670000\",\"signType\":\"RSA\",\"paySign\":\"3Q7DzR6R17mRXkhNf5kfRHfKcgAbAW5nnP6GdR4AItTblEmsw9eHV4kqXQ16RsUzl3KF0QKa5xhlYFhRcZYOkpc73+148HVm6qvCXb4fpHeNCvUqsGy2qUiGjMHhxgWi3CAeFNobOucSYmJJl643YngTC1deOsyMhAwtM8R8lThYDRerZiHhfnJmL0AX7Htp3QV43q2jraAuzqeJoS7FhuPYDoEmaZX0p/Wj14/jb+en9gIA+33IE+xXs4awPQVVSQVj7mZBUCtMpoqyOVg6xkvBLPH3s4CsO8Q+dz7yaj0mddNDC5UPQrvXJrr8HBhqPKctqRelEKFfU7TtAZyUiQ==\"}",
      "status": 1
    }
  })
})


app.get('/weChatDevCheck', function (req, res, next) {
  const token = "butcher";//测试token,与填写配置信息时的token一致
  const signature = req.query.signature;//微信加密签名
  const timestamp = req.query.timestamp;//时间戳
  const echostr = req.query.echostr;//随机字符串
  const nonce = req.query.nonce;//随机数
  console.log(req.query);
  let oriArray = [];//字典排序拼接
  oriArray.push(token);
  oriArray.push(timestamp);
  oriArray.push(nonce);
  let original = oriArray.sort().join('');
  let combineStr = sha1(original);//加密
  console.log(combineStr);
  if (signature === combineStr) {//比较
    res.send(echostr);//返回echostr
  } else {
    console.log('err');
  }
  next();
});


async function templateMessageSend () {
  const token = await getToken();

  const { data: resObj } = await axiosGet('http://192.168.8.68:8081/search')
  const {
    city,
    data: weekData
  } = resObj
  const today = weekData[0]

  // console.log(city)
  // todayResDom.innerHTML = `
  //   <div>${city}</div>
  //   <p>温度:${today.tem}</p>
  //   <p>空气等级:${today.air_level}</p>
  //   <p>天气:${today.phrase}</p>
  //   <p>${today.narrative}</p>
  // `
  const url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
  const params = {
    touser: 'o4nsI6KnuVkOFeTJXcd_NcfxpKBY', // 用户openid 3
    template_id: 'OBW4HjSAavgnMgJTEYq_XH6uF2ejT31jazf9CXH6s8I', // 模板id 4
    url: 'https://weathernew.pae.baidu.com/weathernew/pc?query=%E5%B9%BF%E4%B8%9C%E6%B7%B1%E5%9C%B3%E5%A4%A9%E6%B0%94&srcid=4982',
    topcolor: '#FF0000',
    data: {
      city: {
        value: city,
        color: '#173177',
      },
      tem: {
        value: today.tem,
      },
      narrative: {
        value: today.narrative,
      }
    },
  };
  let res = await axiosPost(url, params);
  console.log('res: ', res.data);
}
templateMessageSend();

app.listen(8081, () => {
  console.log('server running at http://192.168.8.68:8081')
})