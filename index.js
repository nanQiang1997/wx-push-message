const express = require('express')
const sha1 = require('sha1');//引入sha1
const { axiosPost,
  axiosGet,
  getToken } = require('./utils')
const router = require('./router')
const app = express()

app.use(express.static('./static')).use(router)
app.get('/user', (req, res) => {
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

  const { data: resObj } = await axiosGet('http://127.0.0.1:8081/search?keyword=深圳')
  const {
    city,
    data: weekData
  } = resObj
  const today = weekData[0]
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
}
// 获取当前时分
function getHM () {
  const DateRes = new Date();
  const H = DateRes.getHours().toString();
  const M = DateRes.getMinutes().toString();
  return [H, M];
}
let timeName = "";

// 执行定时任务
function timeTest (timeStr, cb) {
  clearTimeout(timeName);
  let [h, m] = timeStr.split(":")
  const [H, M] = getHM();
  timeName = setTimeout(() => {
    if (h === H && M === m) {
      cb();
    } else {
      timeTest(timeStr, cb);
    }
  }, 31000);
}
timeTest("7:30", templateMessageSend);

app.listen(8081, () => {
  console.log('server running at http://127.0.0.1:8081')
})