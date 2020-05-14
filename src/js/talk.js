import "../css/index.scss";
var $ = require('../libs/zepto');
var BScroll = require('../libs/bscroll')
var timeFormat = require('../libs/timeFormat')
var cookie = {
    set: function (cookieKey, cookieValue, cookieOpts) {
        var arr = [];
        var d, t;
        var cfg = {
            'expire': null,
            'customExpire': null,
            'path': null,
            'domain': null,
            'secure': null,
            'encode': true
        };
        $.extend(cfg, cookieOpts);

        if (cfg.encode == true) {
            cookieValue = escape(cookieValue);
        }
        arr.push(cookieKey + '=' + cookieValue);

        if (cfg.path != null) {
            arr.push('path=' + cfg.path);
        }
        if (cfg.domain != null) {
            arr.push('domain=' + cfg.domain);
        }
        if (cfg.secure != null) {
            arr.push(cfg.secure);
        }
        if (cfg.expire != null) {
            d = new Date();
            t = d.getTime() + cfg.expire * 3600000; //cfg.expire * 1小时
            d.setTime(t);
            arr.push('expires=' + d.toGMTString());
        }
        if (cfg.customExpire != null) {
            arr.push('expires=' + cfg.customExpire.toGMTString());
        }
        document.cookie = arr.join(';');
    },
    get: function (cookieKey) {
        cookieKey = cookieKey.replace(/([\.\[\]\$])/g, '\\\$1');
        var rep = new RegExp(cookieKey + '=([^;]*)?;', 'i');
        var co = document.cookie + ';';
        var res = co.match(rep);
        if (res) {
            return res[1] || "";
        } else {
            return null;
        }
    },
    remove: function (cookieKey, cookieOpts) {
        cookieOpts = cookieOpts || {};
        cookieOpts.expire = -10;
        this.set(cookieKey, '', cookieOpts);
    }
};
var bbb = require('../img/bbb.png')
var back = require('../img/back.png')
var year, month, day, hours, minute, seconds = "" //记录现在时间
getNowTime() //获取现在时间函数
var enCodeNickName = decodeURIComponent(cookie.get('nickname')) //获取当前账号昵称
var nickname = decodeURIComponent(enCodeNickName) //虚拟女账号昵称
var enCodeMyMSG = decodeURIComponent(cookie.get('myMSG'))
var myMSG = decodeURIComponent(enCodeMyMSG) //虚拟女账号个人信息
var enCodeHead = decodeURIComponent(cookie.get('myHead')) //虚拟女账户头像地址
var myHead = decodeURIComponent(enCodeHead)
var uid = cookie.get('uid') //虚拟女账号id
var mcheck = cookie.get('mcheck')
var menId = ""; //男性账号
var istalk = false; //判断是否在聊天页
var arr1 = [{
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 90000000,
        is: true,
        weidu: 88,
        sendUserid: 430110954
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 270000000,
        weidu: 8,
        sendUserid: 430133037
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 2040000,
        is: true,
        weidu: 888,
        sendUserid: 430136338
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date('2019/5/14').getTime(),
        is: true,
        weidu: 88
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 600000,
        is: true,
        weidu: 888
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 100000,
        is: true,
        weidu: 88
    },
    {
        name: "芒果",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 88
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 60000,
        weidu: 8
    },
    {
        name: "猕猴桃",
        text: "见个面约一下吗？",
        time: new Date().getTime() - 3540000,
        is: true,
        weidu: 888
    }
]
isLoginOut()
var talkList = new TalkList()
talkList.init() //好友列表页
var intalk = new Intalk()

function getNowTime() {
    var nowDate = timeFormat('yyyy-MM-dd hh:mm:ss', new Date().getTime())
    year = nowDate.substr(0, 4)
    month = nowDate.substr(5, 2)
    day = nowDate.substr(8, 2)
    hours = nowDate.substr(11, 2)
    minute = nowDate.substr(14, 2)
    seconds = nowDate.substr(17, 2)
}

function compileTime(time) {
    var msgAcceptTime = timeFormat('yyyy-MM-dd hh:mm:ss', time) //消息接收时间
    var msgYear = msgAcceptTime.substr(0, 4)
    var msgMonth = msgAcceptTime.substr(5, 2)
    var msgDay = msgAcceptTime.substr(8, 2)
    var msgHours = msgAcceptTime.substr(11, 2)
    var msgMinute = msgAcceptTime.substr(14, 2)
    var msgSeconds = msgAcceptTime.substr(17, 2)
    if (year == msgYear && month == msgMonth && day == msgDay && hours == msgHours) {
        if (minute - msgMinute <= 1) {
            return "刚刚"
        } else if (minute - msgMinute > 1) {
            return minute - msgMinute + "分种前"
        }
    } else if (year == msgYear && month == msgMonth && day == msgDay) {
        return msgHours + ":" + msgMinute
    } else if (year == msgYear && month == msgMonth) {
        if (day - msgDay == 1) {
            return "昨天"
        } else if (day - msgDay == 2) {
            return "前天"
        } else {
            return msgMonth + '-' + msgDay
        }
    } else if (year == msgYear) {
        return msgMonth + '-' + msgDay
    } else {
        return msgYear + "-" + msgMonth + '-' + msgDay
    }
}
// https://alibaba-resource.evkeji.cn/files/uservoice/20200509/430288131/430288131-1589002701_1260.mp3
// 19
function TalkList() {
    this.init = function () {
        this.renderUserList(arr1)
        this.outTalkHtml()
        this.clickListItem()
    }
    this.replaceTitleNicakName = function () {

    }
    this.renderUserList = function (data) {
        var html = '';
        $.each(data, function (index, item) {
            html += ` <li class="item border-1px EverylastBorderDone">
                <div class="hiddenUserid" style="display:none;">${item.sendUserid}</div>
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
    }
    this.outTalkHtml = function () {
        $('.content').removeClass('talkPage')
        $('.accountDefaultStyle').removeClass('accountName')
        $('.mymessage').css('display', 'none')
        $('.title').removeClass('istalk')
        $('footer').css('display', 'none')
        $('.itemWrap').removeClass('talkPage')
        $('.title .accountDefaultStyle').html("账号【" + nickname + "】")
    }

    //点击好友列表项
    this.clickListItem = function () {
        $('.item').tap(function () {
            istalk = true //区分是退出到好友列表页or退出好友列表页
            menId = $(this).find('.hiddenUserid').html()
            intalk.init() //进入聊天界面构造函数
        })
    }

}




Iscroll('main')


function Intalk() {
    this.menHead;
    this.menNickName;
    this.init = function () {
        this.getUserMsg() //获取用户信息
        this.goingTalk() //进入聊天页更改的页面样式已经title
        this.renderTalkHtml() //渲染聊天记录
        this.isImg()
        this.isAudio()
    }
    this.getUserMsg = function () {
        var _this = this
        $.ajax({
            url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                userIds: menId
            },
            success: function (data) {
                _this.menHead = data.content[menId].head
                _this.menNickName = data.content[menId].nickname
            }
        })
    }
    this.goingTalk = function () {
        $('.accountDefaultStyle').addClass('accountName');
        $('.mymessage').css('display', 'block')
        $('.title').addClass('istalk')
        $('footer').css('display', 'block')
        $('.itemWrap').addClass('talkPage')
        $('.title .accountDefaultStyle').addClass("accountName").html(this.menNickName)
        $('.title .mymessage').html("我的资料 : " + myMSG)
    }
    this.renderTalkHtml = function () {
        var html = `<li class="contextBox">
        <div class="head"></div>
        <div class="textBox">
            <div class="jiantouLeft"></div>
            <div class="text">和代好爱上大搜爱神的箭你扫地哈斯迪欧hi殴打扫黄按属地欧萨哄你集的京东is啊</div>
        </div>
    </li>
    <li class="contextBox">
        <div class="head"></div>
        <div class="textBox">
            <div class="jiantouLeft"></div>
            <div class="text">送你礼物 <span>玫瑰花x1</span><span class="yColor">  +1积分</span></div>
        </div>
    </li>
    <li class="contextBox myContentBox">
        <div class="head myhead"></div>
        <div class="textBox mytextBox">
            <div class="jiantouLeft jiantouRight"></div>
            <div class="text">和代好爱上大搜爱神的箭你扫地哈斯迪欧hi殴打扫黄按属地欧萨哄你集的京东is啊</div>
            <div class="pScorce">+0.4积分</div>
        </div>
    </li>

    <li class="talkTime">
        <div class="date">今天 下午 05:34</div>
    </li>

    <li class="contextBox">
        <div class="head"></div>
        <div class="textBox">
            <div class="jiantouLeft"></div>
            <div class="text"><audio src="https://alibaba-resource.evkeji.cn/files/uservoice/20200509/430288131/430288131-1589002701_1260.mp3" controls></audio></div>
        </div>
    </li>

    
    <li class="contextBox">
        <div class="head"></div>
        <div class="textBox">
            <div class="jiantouLeft"></div>
            <div class="text"><audio src="https://alibaba-resource.evkeji.cn/files/uservoice/20200507/430392564/430392564-1588836917_1042.mp3" controls></audio></div>
        </div>
    </li>

    <li class="contextBox">
        <div class="head"></div>
        <div class="textBox">
            <div class="jiantouLeft"></div>
            <div class="text"><video class="video" src="http://page.qxiu.com/ldz/static/test.mp4" webkit-playsinline="allow" playsinline="allow" x5-playsinline="allow" x-webkit-airplay="allow" controls></video></div>
        </div>
    </li>

    <li class="contextBox">
        <div class="head"></div>
        <div class="textBox">
            <div class="jiantouLeft"></div>
            <div class="text"><video class="video" src="http://page.qxiu.com/ldz/static/test2.mp4" webkit-playsinline="allow" playsinline="allow" x5-playsinline="allow" x-webkit-airplay="allow"  controls></video></div>
        </div>
    </li>

    <li class="contextBox">
        <div class="head"></div>
        <div class="textBox">
            <div class="jiantouLeft"></div>
            <div class="text">
                <img src="${bbb}" alt="">
            </div>
        </div>
    </li>`
        $('.itemWrap .content').html(html)
    }
    this.isImg = function () {
        var opt = {
            'font-size': '0',
            "line-height": "0"
        }
        $('.text').children('img').parent().css(opt).parent().css('padding', "0")
        $('.text').children('video').parent().css(opt).parent().css('padding', '0')
    }
    this.isAudio = function () {
        var list = [];
        $('.text').find('audio').each(function (index, item) {
            item.addEventListener("canplay", function () {
                var duration = item.duration
                if (duration <= 1) {
                    $(this).parent().css('width', '30%')
                } else if (duration > 3) {
                    $(this).parent().css('width', '43%')
                } else if (duration > 10) {
                    $(this).parent().css('width', '50%')
                } else if (duration > 30) {
                    $(this).parent().css('width', '65%')
                } else if (duration > 40) {
                    $(this).parent().css('width', '80%')
                }
            });
            $(this).parent().parent().tap(function () {
                if (item.paused) {//没有播放
                    item.play()
                } else {    //播放中
                    item.pause()
                    item.currentTime = 0
                }
            })
        })
    }
}



function Iscroll(el) {
    var bs = new BScroll(el, {
        scrollY: true,
    })
    $('.content').on('touchmove', function () {

    })
    bs.on('touchEnd', function (pos) {

    })
}




//点击back按钮
$('.ListBack').tap(function () {
    if (istalk) {
        talkList.init()
        getNowTime()
        istalk = false
    } else {
        window.location.href = "http://192.168.25.126:8080/login.html"
    }
})

function isLoginOut() {
    if (!uid || !mcheck) {
        window.location.href = "http://192.168.25.126:8080/login.html"
    }
}
var falseData = {
    sign: [{
        msgId: 102,
        content: {

        },
        sendUserid: 430110954
    }]
}