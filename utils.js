
// 需要填写的地方已经标出
// 一共4个地方 appID、appsecret、模板ID、微信用户的openid
const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const axiosPost = function (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
const axiosGet = function (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

async function getToken () {
  const params = {
    grant_type: 'client_credential',
    appid: 'wxb4ae9c75f8974d70', // 你的appid  1
    secret: 'b74edda05e03c8f17cdfe986d12a3757', // 你的secret 2
  };
  let res = await axiosGet('https://api.weixin.qq.com/cgi-bin/token', params);
  return res.data.access_token;
}

async function getFollowUserList (token, nextOpId = '') {
  let res = await axiosGet('https://api.weixin.qq.com/cgi-bin/user/get', { token, nextOpId });
  return res.data.openid
}

module.exports = {
  axiosPost,
  axiosGet,
  getToken,
  getFollowUserList
}