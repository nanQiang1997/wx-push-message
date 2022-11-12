const express = require('express')
const { axiosGet
} = require('./utils')
const router = express.Router()

const puppeteer = require('puppeteer')


async function test () {

  let options = {
    //使用无头模式，默认为有头(true为无界面模式)
    headless: false,
    //设置打开页面在浏览器中的宽高
    defaultViewport: {
      width: 1000,
      height: 800
    }
  }

  //返回浏览器实例
  let browser = await puppeteer.launch(options)
  //创建新页面,并返回页面对象
  let page = await browser.newPage();
  //进入指定页面
  await page.goto('https://m.baidu.com/s?wd=石碣镇天气');


  const cityName = await page.$eval('span.c-line-clamp1', el => el.innerText);
  const clothes = await page.$eval('.box-item__16rFl div.c-line-clamp1.c-color', el => el.innerText);
  const weather = await page.$eval('.ms-weather-main-temp__3xwkT', el => el.innerText);
  const weatherTips = await page.$eval('.ms-weather-main-wind__2RSbd.c-line-clamp1', el => el.innerText);
  const airQuality = await page.$eval('.main-quality-rad__3PHwq.c-color-white', el => el.innerText);

  const dataRes = { cityName, weather, weatherTips, airQuality, clothes }
  console.log(dataRes)
  page.close()
  browser.close()
  return dataRes
}

// test();
// 查询五月初五 是每年公历的几日
async function find55 (year = '') {
  let options = {
    //使用无头模式，默认为有头(true为无界面模式)
    headless: false,
    //设置打开页面在浏览器中的宽高
    defaultViewport: {
      width: 1000,
      height: 800
    }
  }

  //返回浏览器实例
  let browser = await puppeteer.launch(options)
  //创建新页面,并返回页面对象
  let page = await browser.newPage();
  // 
  await page.goto(`https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=${year}端午节日历`);
  // div.calendar-right-date_FVDk_ 
  const date55 = await page.$eval('.calendar-right-date_FVDk_', el => el.innerText);
  browser.close()
  console.log(date55)
  // return date55
}

let day55 = find55()
// let restDay = handleDateRun()
// console.log(day55)
// 日期处理执行
function handleDateRun () {
  let tarBirthDay = returnTmps(day55) + 86400000
  let restTmps = calcDateTmps(tarBirthDay)
  let restDay = getTargetDown(restTmps)

  if (restDay < 0) {
    // 获取下一年 
    let nextYear = new Date.getFullYear() + 1
    day55 = find55(nextYear)
    //  在重新计算
    tarBirthDay = returnTmps(day55) + 86400000
    restTmps = calcDateTmps(tarBirthDay)
    restDay = getTargetDown(restTmps)
  }
  return restDay
}




// 计算 日期时间戳
function calcDateTmps (targetDay) {
  const DateObj = new Date()
  //
  let Y = DateObj.getFullYear()
  let M = DateObj.getMonth() + 1
  let D = DateObj.getDate()

  const CurDay = `${Y}-${M}-${D}`
  // targetDay
  const curTmps = returnTmps(CurDay)
  const targetTmps = returnTmps(targetDay)


  return targetTmps - curTmps
}

// 获取倒计时天数
function getTargetDown (restTmps) {
  // 一天时间戳 86400000 
  const downDay = restTmps / 86400000
  return downDay
}

function returnTmps (dateTime) {
  return new Date(dateTime).getTime()
}




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