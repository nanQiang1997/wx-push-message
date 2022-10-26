const express = require('express')
const sha1 = require('sha1');//引入sha1
const { axiosPost,
  getToken } = require('./utils')
const app = express()

app.use(express.static('./static'))
app.get('/user', (req, res) => {
  console.log(req.query)
  // console.log(res)
  res.send(req.query)
})


app.get('/weChatDevCheck', function (req, res, next) {
  console.log("微信开发接口接入测试");
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

app.post('/user', (req, res) => {
  console.log(req.query)
  // console.log(res)
  res.send(req.query)
})

async function templateMessageSend () {
  const token = await getToken();
  const url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
  const params = {
    touser: 'o4nsI6KnuVkOFeTJXcd_NcfxpKBY', // 用户openid 3
    template_id: 'Zl8BimzC3-K3-pJXn84YR1wf5lwVlNkrFNK_qM8SfoI', // 模板id 4
    url: 'http://ig634x.natappfree.cc/',
    topcolor: '#FF0000',
    data: {
      msg: {
        value: 'hello！',
        color: '#173177',
      },
    },
  };
  let res = await axiosPost(url, params);
  console.log('res: ', res.data);
}
// templateMessageSend();

app.listen(8081, () => {
  console.log('server running at http://192.168.8.68:8081')
})