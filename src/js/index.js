import "../css/index.scss";
var $ = require('../libs/zepto');
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
        weihui: 0
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 0
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
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
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 2
    },
    {
        name: "xiao挂",
        text: "23-北京-背景",
        score: 86,
        weihui: 0
    }
]

renderUserList(arr)

function renderUserList(data) {
    var html = '';
    $.each(data, function (index, item) {
        html += ` <dl class="item border-1px EverylastBorderDone">
            <dd class="taskIcon">
                <img src=""  alt="">
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
                <div class="redIcon">
                    ${haveWeidu(item)}
                    ${item.weihui}条未读
                    </div>
                <div class="plusMoney">
                    积分 : <span class="num">${item.score}</span>
                </div>
                
            </dd>
        </dl>`
    })
    $('.itemWrap').html(html)
    clickListItem()
}

function clickListItem() {
    $('.item').tap(function () {
        window.location.href = "http://192.168.25.126:8080/talk.html"
    })
}
// 点击返回
$('.ListBack').tap(function () {
    window.history.back()
})
// 有未读消息显示红点
function haveWeidu(item) {
    var have = ""
    if (item.weihui != 0) {
        have = '<div class="dian"></div>'
    } else {
        have = ""
    }
    return have
}