import "../css/index.scss";
var $ = require('../libs/zepto');
var BScroll = require('../libs/bscroll')
var istalk = false; //判断是否在聊天页
var arr1 = [{
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "你的小爸爸",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    }
]
// renderUserList(arr1)

function renderUserList(data) {
    var html = '';
    $.each(data, function (index, item) {
        html += ` <li class="item border-1px EverylastBorderDone">
            <div class="taskIcon">
                <img src="" alt="">
            </div>
            <div class="taskContent">
                <div class="taskName">${item.name}</div>
                <div class="taskContext">
                    <span class="message">
                    ${item.is ? "[已回复]" :item.text }</span>
                </div>
            </div>
            <div class="contentWrap">
                <div class="redIcon">
                    ${compileTime(item.time)}
                    </div>
                <div class="plusMoney">
                    <span class="xiaoxi">${item.weidu}</span>
                </div>
                
            </div>
        </li>`
    })
    $('.content').html(html)
    clickListItem()
}
function clickListItem() {
    $('.item').tap(function () {
        istalk = true
        replaceTitle()
        $('.content').addClass('talkPage')
        $('.content').html('')
    })
}

$('.ListBack').tap(function () {
    if (istalk) {
        renderUserList(arr1)
        $('.content').removeClass('talkPage')
        outTalk()
        istalk = false
    } else {
        window.history.back()
    }
})



function compileTime(time) {
    var nowDate = new Date().getTime()
    if ((nowDate - time) <= 65000) { //刚刚
        return "刚刚"
    } else if ((nowDate - time) <= 305000) { //5分钟前
        return "5分钟前"
    }
}

function replaceTitle() {
    $('.accountDefaultStyle').addClass('accountName');
    $('.mymessage').css('display', 'block')
    $('.title').addClass('istalk')
    $('footer').css('display', 'block')
    $('.itemWrap').addClass('talkPage')
}

function outTalk() {
    $('.accountDefaultStyle').removeClass('accountName')
    $('.mymessage').css('display', 'none')
    $('.title').removeClass('istalk')
    $('footer').css('display', 'none')
    $('.itemWrap').removeClass('talkPage')
}