/*
 * @Author: tushan
 * @Date: 2022-12-14 21:13:56
 * @LastEditors: tushan
 * @LastEditTime: 2022-12-15 19:15:56
 * @Description: 
 */
const { ipcRenderer, ipcMain } = require("electron");
const Qs = require('qs')
const getCookie = () => {
  url = document.querySelector(".view").src;
  let a = document.createElement("a")
  a.href = url;
  ipcRenderer.send("getCookie", {
    domain: a.hostname.replace("www.", '')
  })
}
ipcRenderer.on("message", function (event, data) {
  console.log("cookit源数据");
  console.table(data);
  let str = ""
  data.forEach(element => {
    str += '; ' + element.name + '=' + element.value;
  });
  str = str.slice(2)
  console.log("cookit组合后数据");
  console.log(str);
  var axios_instance = axios.create({
    baseURL: 'http://173.0.57.133:8866',
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  axios_instance.post('/receive/cookie', {
    cookies: str
  }).then(el => {
    console.log('服务器返回shuju', el);
  })
})


document.querySelector("#getCookie").onclick = getCookie
document.querySelector("#refresh").onclick = function (params) {
  document.querySelector(".view").reload()
}
document.querySelector("#open").onclick = function (params) {
  document.querySelector(".view").src = document.querySelector("#url").value
}

let reloadAuto = false
$("#closeboot").hide()
document.querySelector("#openboot").onclick = function () {
  $("#openboot").hide()
  $("#closeboot").show()
  let pl = $("#pl").val();
  setTime(parseInt(pl) * 1000 * 60)
  reloadAuto = true
  submit()
}
let tm = null
document.querySelector("#closeboot").onclick = function () {
  $("#openboot").show()
  $("#closeboot").hide()
  clearTimeout(tm);
  tm = null
  reloadAuto = false
}
function setTime(num) {
  tm = setInterval(() => {
    submit()
  }, num);
}
const submit = () => {
  if (reloadAuto) {
    function sub() {
      getCookie()
      document.querySelector(".view").removeEventListener("did-stop-loading", sub)
    }
    document.querySelector(".view").addEventListener("did-stop-loading", sub)
    document.querySelector(".view").reload()
  }
}
$("#back").click(() => {
  document.querySelector(".view").goBack()
})

$("#qj").click(() => {
  document.querySelector(".view").goForward()
})
$("#reload").click(() => {
  ipcRenderer.send("reload", {

  })
})
$("#trem").click(() => {
  ipcRenderer.send("trem", {

  })
})