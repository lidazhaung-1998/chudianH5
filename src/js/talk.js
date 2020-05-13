import "../css/index.scss";
var $ = require('../libs/zepto');
var BScroll = require('../libs/bscroll')
var bbb = require('../img/bbb.png')
var istalk = false; //判断是否在聊天页
var arr1 = [{
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
        time: new Date().getTime() - 300000,
        is: true,
        weidu: 888
    }
]
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
isLoginOut()
var talkList = new TalkList()
talkList.init()
var intalk = new Intalk()

function TalkList() {
    this.init = function () {
        this.renderUserList(arr1)
        this.outTalkHtml()
        this.clickListItem()
    }
    this.renderUserList = function (data) {
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
    }
    this.outTalkHtml = function () {
        $('.content').removeClass('talkPage')
        $('.accountDefaultStyle').removeClass('accountName')
        $('.mymessage').css('display', 'none')
        $('.title').removeClass('istalk')
        $('footer').css('display', 'none')
        $('.itemWrap').removeClass('talkPage')
    }
    this.clickListItem = function () {
        $('.item').tap(function () {
            istalk = true //区分是退出到好友列表页or退出好友列表页
            intalk.init()
        })
    }

}




Iscroll('main')

function Intalk() {
    this.init = function () {
        this.goingTalk() //进入聊天页
        this.renderTalkHtml()
        this.isImg()
    }
    this.goingTalk = function () {
        $('.accountDefaultStyle').addClass('accountName');
        $('.mymessage').css('display', 'block')
        $('.title').addClass('istalk')
        $('footer').css('display', 'block')
        $('.itemWrap').addClass('talkPage')
    }
    this.renderTalkHtml = function () {
        $('.itemWrap .content').html(`<li class="contextBox">
            <div class="head"></div>
            <div class="textBox">
                <div class="jiantouLeft"></div>
                <div class="text">和代好爱上大搜爱神的箭你扫地哈斯迪欧hi殴打扫黄按属地欧萨哄你集的京东is啊</div>
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
                <div class="text">和代好爱上大搜爱神的箭你扫地哈斯迪欧hi殴打扫黄按属地欧萨哄你集的京东is啊</div>
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
        </li>`)
    }
    this.isImg = function () {
        $('.text').each(function (index, item) {
            if ($(this).children('img').length >= 1) {
                $(this).parent().css('padding', '0')
            }
        })
    }
}
$('.ListBack').tap(function () {
    if (istalk) {
        talkList.init()
        istalk = false
    } else {
        window.location.href = "http://192.168.25.126:8080/login.html"
    }
})

function Iscroll(el) {
    var bs = new BScroll(el)
    $('.content').on('touchmove', function () {
        if (bs.y >= 50) {
            // 上啦刷新
        }
    })
}

function compileTime(time) {
    var nowDate = new Date().getTime()
    if ((nowDate - time) <= 65000) { //刚刚
        return "刚刚"
    } else if ((nowDate - time) <= 305000) { //5分钟前
        return "5分钟前"
    }
}


function isLoginOut() {
    if (!cookie.get('uid') || !cookie.get('mcheck')) {
        window.location.href = "http://192.168.25.126:8080/login.html"
    }
}