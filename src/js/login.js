var $ = require('../libs/zepto')
import "../css/login.scss"
var username = 123456
var password = 123456789
$('.login').tap(function () {
    var userName = $('.username').val()
    var passWord = $('.password').val()
    if(userName != username) {
        alert('账号有误')
    } else if(passWord != password) {
        alert('密码与账号不匹配')
    } else {
        window.location.href = "http://192.168.25.126:8080/index.html"
    }
})






var arr = [{
        name: "xiao",
        text: "23-背景-背景",
        score: 20,
        weihui: 99
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
]


function renderUserList(data) {
    var html = '';
    $.each(data, function (index, item) {
        html += ` <dl class="item border-1px EverylastBorderDone">
            <dd class="taskIcon">
                <img  alt="">
            </dd>
    
            <dd class="taskContent">
                <div class="taskName">${item.name}</div>
                <!-- taskName -->
                <div class="taskContext">
                    <span class="message"> ${item.text}</span>
                </div>
                <!-- taskContent -->
            </dd>
            <dd class="contentWrap">
                <div class="status">
                    <img alt="">
                </div>
                <div class="plusMoney">
                    积分:<span class="num">${item.score}</span>
                </div>
                <div class="redIcon">未回消息${item.weihui}条</div>
            </dd>
        </dl>`
    })
    $('.itemWrap').html(html)
    click()
}