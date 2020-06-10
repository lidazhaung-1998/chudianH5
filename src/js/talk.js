import "../css/index.scss";
import kkkk from "./kkkk";
var $ = require('../libs/zepto');
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
var amr;

var year, month, day, hours, minute, seconds, Base64Img = "" //记录现在时间
getNowTime() //获取现在时间函数
var enCodeNickName = decodeURIComponent(cookie.get('nickname')) //获取当前账号昵称
var nickname = decodeURIComponent(enCodeNickName) //虚拟女账号昵称
var enCodeMyMSG = decodeURIComponent(cookie.get('myMSG'))
var myMSG = decodeURIComponent(enCodeMyMSG) //虚拟女账号个人信息
var enCodeHead = decodeURIComponent(cookie.get('myHead')) //虚拟女账户头像地址
var myHead = decodeURIComponent(enCodeHead)
var uid = cookie.get('uid') //虚拟女账号id
var mcheck = cookie.get('mcheck')
var token = cookie.get('token')
var menId, menName, menHead = ""; //男性账号
var istalk = false; //判断是否在聊天页
isLoginOut()
var intalk = new Intalk();
var inTalk = false;
var maxid, lastmsg, lasttext, obj, menAllId, msgLength, oldid, lastMsgTime, loop = null;
var timer2 = "";
var bl = true;
var timerUpdata = "";

function getNowTime() {
    var nowDate = timeFormat('yyyy-MM-dd hh:mm:ss', new Date().getTime())
    year = nowDate.substr(0, 4)
    month = nowDate.substr(5, 2)
    day = nowDate.substr(8, 2)
    hours = nowDate.substr(11, 2)
    minute = nowDate.substr(14, 2)
    seconds = nowDate.substr(17, 2)
}
getScorce()

function getScorce() {
    $.ajax({
        url: "http://cgi-vas.evkeji.cn/sns/cash/userpoint/get?",
        type: "POST",
        dataType: "json",
        async: true,
        data: {
            userId: uid,
            meck: mcheck
        },
        success: function (req) {
            $('.showScorce').html("总积分:" + req.content.balance)
        }
    })
}
setInterval(getScorce, 7000)

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
            return minute - msgMinute + "分钟前"
        }
    } else if (year == msgYear && month == msgMonth && day == msgDay) {
        return msgHours + ":" + msgMinute
    } else if (year == msgYear && month == msgMonth) {
        if (day - msgDay == 1) {
            return "昨天"
        } else if (day - msgDay == 2) {
            return "前天"
        } else {
            return msgMonth + '-' + msgDay + "&nbsp;" + msgHours + ":" + msgMinute
        }
    } else if (year == msgYear) {
        return msgMonth + '-' + msgDay
    } else {
        return msgYear + "-" + msgMonth + '-' + msgDay
    }
}
var talkList = new TalkList()
talkList.init() //好友列表页
function TalkList() {
    this.flag = true
    this.scrollT = 0;
    this.init = function () {
        this.flag = true
        maxid = 0; //目前最大消息
        lastmsg = []; //最后一条信息
        lasttext = []
        obj = {} //男性用户id，和发送了几条消息
        menAllId = [] //发送消息的所有男用户id
        msgLength = []; //发消息的所有男用户的消息条数
        lastMsgTime = []; //发消息的所有男用户的最后一条消息时间
        loop = [];
        oldid = 0;
        this.colls = [];
        var _this = this;
        _this.renderUserList();
        this.upData(100)
        setTimeout(function () {}, 300)
        timerUpdata = setInterval(function () {
            _this.upData(100)
        }, 2000)
        this.outTalkHtml()
        this.scrollPosition()
        setTimeout(function () {
            kkkk.clearMaxLength([uid], 100);
        }, 5000)
    }
    this.upData = function (num) {
        var _this = this;
        $.ajax({
            url: "http://121.46.195.211:13888/delegate/msg/refresh/" + uid,
            type: "POST",
            async: true,
            data: {
                limit: num,
                targetId: "",
                lastId: maxid,
                token: token
            },
            success: function (data) {
                data.content = data.content.reverse();
                kkkk.updateReplyLastMsg(uid, data);
                _this.renderUserList();

                if (data.content[0].id > maxid) {
                    maxid = data.content[0].id;
                }
                //bl = true
                // for (var i = 0; i < data.content.length; i++) {
                // if (data.content[i].id > maxid) {
                // console.log(_this.colls)
                // if (_this.colls[1] == data.content[i].content.int64_target_user_id)
                // maxid = data.content[i].id
                // if (_this.flag) {
                // _this.handleArray(data.content)

                //_this.flag = false
                // } else {
                // if (bl) {
                // console.log(data)
                // data.content = data.content.reverse();
                // var reverseData = data;
                // kkkk.updateReplyLastMsg(uid, reverseData)
                // _this.newMsg(data.content)
                //_this.renderUserList()
                //_this.state()
                // }
                // }
                // }
                // }

            }
        })
    }
    this.state = function () {
        $('.message').each(function (index, item) {
            if ($(this).html() == "已回复") {
                $(this).css("color", "green")
            } else {
                $(this).css("color", "red")
            }
        })
    }
    this.handleArray = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            // 发送者消息接收者是当前虚拟女号得id才是正确未读消息
            if (arr[i].content.int64_user_id != uid) {
                if (obj[arr[i].content.int64_user_id]) {
                    obj[arr[i].content.int64_user_id]++
                } else {
                    obj[arr[i].content.int64_user_id] = 1
                }
            }
        }
        for (var at in obj) {
            if (at != uid) {
                menAllId.push(at)
                msgLength.push(obj[at])
            }
        }
        this.lastMSGData()
        menAllId = menAllId.reverse()
        msgLength = msgLength.reverse()
    }
    this.lastMSGData = function () {
        for (var i = 0; i < menAllId.length; i++) {
            $.ajax({
                url: "http://121.46.195.211:13888/delegate/msg/refresh/" + uid,
                type: "GET",
                async: false,
                data: {
                    limit: 1,
                    targetId: menAllId[i],
                    lastId: 0,
                    token: token
                },
                success: function (data) {
                    lastMsgTime.push(data.content[0].content.int64_time)
                    if (data.content[0].content.string_tp == "QI:FlatterMsg") {
                        lastmsg[i] = '搭讪消息'
                    } else if (data.content[0].content.string_tp == "RC:VcMsg") {
                        lastmsg[i] = "语音消息"
                    } else if (data.content[0].content.string_tp == "RC:ImgMsg") {
                        lastmsg[i] = "图片"
                    } else if (data.content[0].content.string_tp == "RC:SightMsg") {
                        lastmsg[i] = "视频消息"
                    } else if (data.content[0].content.string_tp == "RC:TxtMsg") {
                        lastmsg[i] = data.content[0].content.msg_user_private.string_content
                    } else if (data.content[0].content.string_tp == "QI:GiftMsg") {
                        lastmsg[i] = "收到了对方送出的礼物"
                    }
                    if (data.content[0].content.int64_user_id == uid) {
                        lastmsg[i] = '已回复'
                    }
                }

            })
        }
        lastMsgTime.reverse()
        lastmsg = lastmsg.reverse()
    }
    this.newMsg = function (newArr) {
        menAllId = []
        msgLength = []
        loop = []
        lastMsgTime = []
        for (var i = 0; i < newArr.length; i++) {

            if (obj[newArr[i].content.int64_user_id]) {
                obj[newArr[i].content.int64_user_id]++
            } else {
                obj[newArr[i].content.int64_user_id] = 1
            }


        }
        for (var ar in obj) {
            if (ar != uid) {
                menAllId.push(ar)
                msgLength.push(obj[ar])
            }
        }
        this.lastMSGData()
        lastmsg.reverse()
        lastMsgTime = lastMsgTime.reverse()
        bl = false
    }
    this.Funsort = function aaa(arr) {
        arr.sort(function (t1, t2) {
            var one = t1.querySelectorAll('.time')[0].innerText;
            var two = t2.querySelectorAll('.time')[0].innerText;
            if (one < two) {
                return 1
            } else if (one == two) {
                return 0
            } else {
                return -1
            }
        })
        return arr
    }
    this.domSort = function () {
        var domArr = Array.apply(Array, document.querySelectorAll('.content .item'))
        var newArr = [];
        var yepBack = [];
        domArr.forEach(function (item, inde) {
            var time = item.querySelectorAll('.time')[0].innerText;
            var isBack = item.querySelectorAll('.message')[0].innerText;
            isBack == "已回复" ? yepBack.push(item) : newArr.push(item)
        })
        var lastArr = this.Funsort(newArr).concat(this.Funsort(yepBack))
        $('.content').html('')
        $('.content').append(lastArr)
    }
    this.renderUserList = function () {
        var _this = this;
        var html = '';

        var recode = kkkk.getRecode(uid);
        var recodeList = kkkk.getOrderRecode(uid, recode);
        var userIds = [];
        for (var i in recodeList) {
            var item = recodeList[i];
            var userId = item["userId2"];
            userIds.push(userId);
        }

        $.ajax({
            url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
            type: "POST",
            dataType: "json",
            async: true,
            data: {
                userIds: userIds.join(',')
            },
            success: function (data) {
                // console.log(data)
                for (var i = 0; i < userIds.length; i++) {
                    var userid = userIds[i]
                    var content = recode[uid + "-" + userid].content;
                    html += ` <li id="${'u'+userid}" class="item border-1px EverylastBorderDone">
                        <div class="hiddenUserid" style="display:none;">${userid}</div>
                        <div class="taskIcon" style="background-image:url(${data.content[userid].head});"></div>
                        <div class="hiddenHead" style="display:none;">${data.content[userid].head}</div>
                        <div class="hiddenName" style="display:none;">${data.content[userid].nickname}</div>
                        <div class="taskContent">
                            <div class="taskName">${data.content[userid].nickname}</div>
                            <div class="taskContext">
                                <span class="message">${kkkk.msgType(content,uid)}</span>
                            </div>
                        </div>
                        <div class="contentWrap">
                            <div class="redIcon">${compileTime(content.int64_time)}</div>
                            <div class="time" style="display:none;">${lastMsgTime[i]}</div>
                            <div class="plusMoney">
                            </div>
                        </div>
                    </li>`
                }
                $('.content').html(html)
                _this.clickListItem()
                _this.state()
                // _this.domSort()
            }
        })

    }
    // this.renderUserList = function () {
    //     console.log(this.colls)
    //     var _this = this;
    //     var html = '';
    //     $.ajax({
    //         url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
    //         type: "POST",
    //         dataType: "json",
    //         async: true,
    //         data: {
    //             userIds: menAllId.join(',')
    //         },
    //         success: function (data) {
    //             for (var i = 0; i < menAllId.length; i++) {
    //                 var userid = menAllId[i]
    //                 html += ` <li class="item border-1px EverylastBorderDone">
    //                     <div class="hiddenUserid" style="display:none;">${userid}</div>
    //                     <div class="taskIcon" style="background-image:url(${data.content[userid].head});"></div>
    //                     <div class="hiddenHead" style="display:none;">${data.content[userid].head}</div>
    //                     <div class="hiddenName" style="display:none;">${data.content[userid].nickname}</div>
    //                     <div class="taskContent">
    //                         <div class="taskName">${data.content[userid].nickname}</div>
    //                         <div class="taskContext">
    //                             <span class="message">${lastmsg[i]}</span>
    //                         </div>
    //                     </div>
    //                     <div class="contentWrap">
    //                         <div class="redIcon">${compileTime(lastMsgTime[i])}</div>
    //                         <div class="time" style="display:none;">${lastMsgTime[i]}</div>
    //                         <div class="plusMoney">
    //                         </div>
    //                     </div>
    //                 </li>`
    //             }
    //             $('.content').html(html)
    //             _this.clickListItem()
    //             _this.state()
    //             _this.domSort()
    //         }
    //     })
    // }
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
        var _this = this;
        $('.item').tap(function () {
            istalk = true //区分是退出到好友列表页or退出好友列表页
            menId = $(this).find('.hiddenUserid').html()
            menName = $(this).find('.hiddenName').html()
            menHead = `style="background-image:url(${$(this).find('.hiddenHead').html()})"`
            _this.scrollT = $('.content').scrollTop()
            clearInterval(timerUpdata)
            intalk.init() //进入聊天界面
            inTalk = true
        })
    }
    this.scrollPosition = function () {
        this.scrollT == 0 ? $('.itemWrap').scrollTop(0) : $('.itemWrap').scrollTop(this.scrollT)
    }
}



// 聊天界面
function Intalk() {
    this.menNickName = "";
    this.initLength = 0;
    this.nantou = "";
    this.nvtou = `style="background-image:url(${myHead});"`
    this.nowMySendMsg = null;
    this.max = 0;
    this.min = 100000000;
    this.handleHtml = {
        textMsg: function (head, text, my) {
            var textHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                <div class="textBox ${my.c}">
                                    <div class="jiantouLeft ${my.d}"></div>
                                    <div class="text"><span>${text}</span></div>
                                    ${my.e ? `<div class='pScorce'>${my.e}积分</div>` : ""}
                                </div>
                            </li>`
            return textHtml
        },
        audioMsg: function (head, audio, my, time) {
            var audioHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                
                                <div class="textBox ${my.c}">
                                    <div class="jiantouLeft ${my.d}"></div>
                                    <div class="text">
                                        <div class="audioTime">${time}s</div> 
                                        <audio src="${audio}" controls></audio>
                                        ${my.e ? `<div class='pScorce'>${my.e}积分</div>` : ""}
                                    </div>
                                </div>
                                <div class="lineBar">
                                    <div style="height:.11rem;background:#000;position:absolute;bottom:0;left:-.08rem;"></div>
                                    <div style="height:.18rem;background:#000;position:absolute;bottom:0;left:.02rem;"></div>
                                    <div style="height:.1rem;background:#000;position:absolute;bottom:0;left:.12rem;"></div>
                                    <div style="height:.24rem;background:#000;position:absolute;bottom:0;left:.22rem;"></div>
                                    <div style="height:.29rem;background:#000;position:absolute;bottom:0;left:.32rem;"></div>
                                    <div style="height:.19rem;background:#000;position:absolute;bottom:0;left:.42rem;"></div>
                                    <div style="height:.17rem;background:#000;position:absolute;bottom:0;left:.52rem;"></div>
                                    <div style="height:.06rem;background:#000;position:absolute;bottom:0;left:.62rem;"></div>
                                    <div style="height:.02rem;background:#000;position:absolute;bottom:0;left:.72rem;"></div>
                                </div
                            </li>`
            return audioHtml
        },
        videoMsg: function (head, video, my) {
            var videoHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                <div class="textBox ${my.c}" style="padding:0;">
                                
                                    <div class="text">  <video class="video" src="${video}" preload="auto" webkit-playsinline="allow" playsinline="allow" x5-playsinline="allow" x-webkit-airplay="allow" controls></video></div>
                                </div>
                            </li>`
            return videoHtml
        },
        imgMsg: function (head, image, my) {
            var imageHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                <div class="textBox ${my.c}" style="padding:0;">
                                    <div class="text">
                                        <img src="${image}" alt="">
                                    </div>
                                    ${my.e ? `<div class='pScorce'>${my.e}积分</div>` : ""}
                                </div>
                            </li>`
            return imageHtml
        },
        giftMsg: function (head, gift, num, scorce, url, my, target) {
            var giftHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                <div class="textBox ${my.c}">
                                <div class="jiantouLeft ${my.d}"></div>
                                <div class="text">送你礼物 <span>${'“'+target+'”' + gift + `<img style="width:.5rem;height:.5rem;vertical-align:bottom;" src="${url}"/>x` + num}</img><span class="yColor"></span></div>
                                </div>
                            </li>`
            return giftHtml
        },
        giftTMsg: function (head, gift, num, my, target) {
            var giftHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                <div class="textBox ${my.c}">
                                <div class="jiantouLeft ${my.d}"></div>
                                <div class="text">送你礼物 <span>${'“'+target+'”收到礼物“' + gift + "”x" + num}</span><span class="yColor"></span></div>
                                </div>
                            </li>`
            return giftHtml
        },
        apdTime: function (date) {
            var dateHtml = `<li class="talkTime">
                                <div class="date">${date}</div>
                            </li>`
            return dateHtml
        },
        mySengMsgTime: function (date) {
            var dateHtml = `<li class="mytalkTime">
                        <div class="date">${date}</div>
                    </li>`
            return dateHtml
        }

    }
    this.init = function () {
        $('.content').html('')
        $('.app').css("background", '#333')

        this.getTalkMsg() //获取聊天记录并渲染聊天记录
        this.goingTalk() //进入聊天页更改的页面样式已经title
        this.initLength = $('.content .contextBox').length
        this.getHuashu() //获取话术
        this.getCity()
        var _this = this
        if (!inTalk) {
            this.isAudio() //是音频做出相应处理
            this.tapImg()
            this.choseImg() //点击选择图片
            this.tapHuashu() //点击选中话术
            this.tapSendMsg() //点击发送
            this.scroll()
            this.closeBigImg()
            this.tapEmoji()
            this.chooseEmoji()
        }
        setTimeout(function () {
            $('.itemWrap').scrollTop($('.content').height() + 1000)
        }, 500)

        timer2 = setInterval(function () {
            $('.content').append(_this.appendNewMsg())
            _this.newMsgHandle($('.itemWrap .content .contextBox').length)
        }, 1500) // TODO CALLSEND
        setTimeout(function () {
            kkkk.clearMaxLength([uid], 100);
        }, 5000)
    }
    this.getCity = function () {
        $.ajax({
            url: "http://cgi-base.evkeji.cn/sns/base/location/getLocation?",
            type: "POST",
            async: true,
            data: {
                userId: uid,
                fromUserId: uid
            },
            success(data) {
                console.log(data)
                var address = data.content.province + ' ' + data.content.city
                $('.mymessage').html($('.mymessage').html() + address)
            }
        })
    }
    this.getTalkMsg = function () {
        var self = this;
        $.ajax({
            url: "http://121.46.195.211:13888/delegate/msg/refresh/" + uid + "?",
            type: "POST",
            async: false,
            dataType: "json",
            data: {
                limit: "",
                targetId: menId,
                token: token,
                lastId: 0
            },
            success: function (data) {
                // console.log(data)
                for (var i = 0; i < data.content.length; i++) {
                    if (data.content[i].id > self.max) {
                        self.max = data.content[i].id
                    }
                    if (data.content[i].id < self.min) {
                        self.min = data.content[i].id
                    }
                }
                // console.log(data)
                self.renderTalkHtml(data.content.reverse())
            }
        })
    }
    this.talkTime = function (time) {
        var msgAcceptTime = timeFormat('yyyy-MM-dd hh:mm:ss', time) //消息接收时间
        var msgYear = msgAcceptTime.substr(0, 4)
        var msgMonth = msgAcceptTime.substr(5, 2)
        var msgDay = msgAcceptTime.substr(8, 2)
        var msgHours = msgAcceptTime.substr(11, 2)
        var msgMinute = msgAcceptTime.substr(14, 2)
        var msgSeconds = msgAcceptTime.substr(17, 2)
        if (year == msgYear && month == msgMonth && day == msgDay) {
            return "今天" + msgHours + ":" + msgMinute
        } else if (year == msgYear && month == msgMonth) {
            if (day - msgDay == 1) {
                return "昨天&nbsp;" + msgHours + ":" + msgMinute
            } else if (day - msgDay == 2) {
                return "前天&nbsp;" + msgHours + ":" + msgMinute
            } else {
                return msgMonth + '-' + msgDay + "&nbsp;" + msgHours + ":" + msgMinute
            }
        } else if (year == msgYear) {
            return msgMonth + '-' + msgDay
        } else {
            return msgYear + "-" + msgMonth + '-' + msgDay
        }
    }
    this.goingTalk = function () {
        $('.accountDefaultStyle').addClass('accountName');
        $('.mymessage').css('display', 'block')
        $('.title').addClass('istalk')
        $('footer').css('display', 'flex')
        $('.itemWrap').addClass('talkPage')
        $('.title .accountDefaultStyle').addClass("accountName").html(menName)
        $('.title .mymessage').html(nickname + " | " + myMSG)
    }
    this.renderTalkHtml = function (Data) {
        $('.itemWrap .content').html($('.itemWrap .content').html() + this.whoMsg(Data))
    }
    this.whoMsg = function (falseData) {
        var _this = this;
        var html = "";
        $.each(falseData, function (index, item) {
            var targetid = item.content.int64_target_user_id
            var sendid = item.content.int64_user_id
            var loway = item.content
            if (sendid == uid) {
                html += _this.handleHtml.mySengMsgTime(_this.talkTime(item.content.int64_time))
            } else {
                html += _this.handleHtml.apdTime(_this.talkTime(item.content.int64_time))
            }
            if (targetid == uid) { //接收的消息      targetid 等于 uid   接受消息得是我
                if (loway.string_tp == "RC:TxtMsg") { //文本消息
                    html += _this.handleHtml.textMsg(menHead, loway.msg_user_private.string_content, {})
                } else if (loway.string_tp == "RC:VcMsg") { //语音消息
                    html += _this.handleHtml.audioMsg(menHead, loway.msg_user_audio.string_content, {}, loway.msg_user_audio.uint32_auido_duration)
                } else if (loway.string_tp == "RC:SightMsg") { //视频消息
                    html += _this.handleHtml.videoMsg(menHead, loway.msg_user_small_video.string_video_url, {})
                } else if (loway.string_tp == "RC:ImgMsg") { //图片
                    html += _this.handleHtml.imgMsg(menHead, loway.msg_user_image.string_image_url, {})
                } else if (loway.string_tp == "QI:FlatterMsg") { //搭讪礼物
                    html += _this.handleHtml.giftMsg(menHead, loway.msg_user_flatter.string_content, loway.msg_user_flatter.uint32_goods_num, loway.msg_user_flatter.uint32_goods_num, loway.msg_user_flatter.string_image_url, {}, '你')
                } else if (loway.string_tp == "QI:GiftMsg") { //礼物
                    html += _this.handleHtml.giftTMsg(menHead, loway.msg_user_goods.string_goods_name, loway.msg_user_goods.uint32_goods_num, {}, '你')
                }
            }
            if (sendid == uid) { //我发送的消息               sendid 等于 uid  发送消息的是我
                if (loway.string_tp == "RC:TxtMsg") {
                    html += _this.handleHtml.textMsg(_this.nvtou, loway.msg_user_private.string_content, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                    })
                } else if (loway.string_tp == "RC:ImgMsg") {
                    html += _this.handleHtml.imgMsg(_this.nvtou, loway.msg_user_image.string_image_url, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                    })
                } else if (loway.string_tp == "RC:VcMsg") {
                    html += _this.handleHtml.audioMsg(_this.nvtou, loway.msg_user_audio.string_content, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                    }, loway.msg_user_audio.uint32_auido_duration)
                } else if (loway.string_tp == "QI:FlatterMsg") {
                    html += _this.handleHtml.giftMsg(_this.nvtou, loway.msg_user_flatter.string_content, loway.msg_user_flatter.uint32_goods_num, loway.msg_user_flatter.uint32_goods_num, loway.msg_user_flatter.string_image_url, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                    }, menName)
                } else if (loway.string_tp == "RC:SightMsg") {
                    html += _this.handleHtml.videoMsg(_this.nvtou, loway.msg_user_small_video.string_video_url, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                    })
                }
            }
        })
        // console.log(html)
        return html
    }

    this.isAudio = function () {
        //播放音频按下事件
        $('.content').delegate('.textBox', 'touchstart', function () {
            var item = $(this).find('.text audio')[0]
            if (!item) {
                return
            }
            $(this).css("background", '#ccc')
            $(this).find('.jiantouLeft').css({
                "border-right": ".15rem solid #ccc"
            })
            var newSrc = $(this).find('audio').attr('src').substr(34)
            var src = $(this).find('audio').attr()
            amr = new BenzAMRRecorder()
            amr.initWithUrl("/api" + newSrc).then(function () {
                if (item.getAttribute("playing")) {
                    amr.stop()
                    item.removeAttribute("playing")
                } else {
                    amr.play();
                }
            })
            amr.onPlay(function () {
                item.setAttribute("playing", true)
            })
        })
        //播放音频抬起事件
        $('.content').delegate('.textBox', 'touchend', function () {
            var item = $(this).find('.text audio')[0]
            if (!item) {
                return;
            }
            var _this = $(this)
            setTimeout(function () {
                if (_this.hasClass('mytextBox')) {
                    _this.css("background", '#7de8f2')
                    _this.find('.jiantouRight').css({
                        "border-right": ".15rem solid #7de8f2"
                    })
                } else {
                    _this.css("background", '#fff')
                    _this.find('.jiantouLeft').css({
                        "border-right": ".15rem solid #fff"
                    })
                }
            }, 300)
        })
    }
    this.tapEmoji = function () {
        $('.Block').tap(function () {
            $('.emoji').toggle(200)
        })
    }
    this.chooseEmoji = function () {
        $('td').tap(function () {
            $('.input').val(String($('.input').val()) + String($(this).html()))
            $('.emoji').hide(200)
        })
    }
    this.choseImg = function () {
        $('.click').on('touchstart', function () {

            $(this).css("background", "#ccc")
            if ($(this).hasClass('checkImg')) {
                // return;
            } else {
                //按下的是快捷话语
                $('.huashu').show(500).css('display', 'flex')
            }
        })
        $('.click').on('touchend', function () {
            $(this).css("background", "none")
        })
        $('.cancel').tap(function () {
            $('.huashu').hide(500)
        })
    }
    //获取话术
    this.getHuashu = function () {
        var huashuHtml = "";
        $.ajax({
            url: "http://121.46.195.211:13888/delegate/res/quickreplylist/" + uid,
            type: "POST",
            cache: false,
            success: function (data) {
                for (var i = 0; i < data.content.length; i++) {
                    huashuHtml += `<li class="huashu_text">${data.content[i]}</li>`
                }
                $('.huashu_textWrap').html(huashuHtml)
            }
        })
    }
    //点击快捷话语输入框中展现选中语句
    this.tapHuashu = function () {
        $('.huashu_textWrap').delegate('.huashu_text', 'tap', function () {
            $('.inputBox .input').val($(this).html())
        })
        $('.huashu_textWrap').delegate('.huashu_text', 'touchend', function () {
            var _this = $(this)
            $(this).css("background", "#999")
            setTimeout(function () {
                _this.css("background", "none")
            }, 300)
            $('.huashu').hide(500)
        })
    }
    //点击发送消息按钮
    this.tapSendMsg = function () {
        var _this = this;
        $('.sendmsgbox').tap(function () {
            var inp = $('.input')
            var val = inp.val()
            _this.sendMsg(val)
            inp.val('')
            var len = $('.content .contextBox').length;
            $('.itemWrap').scrollTop($('.content .contextBox').get(len - 1).offsetTop)
            //发起请求
            _this.nowMySendMsg = len - 1
        })
        $('.inputFile').on('change', function () {
            var imgMaxSize = 1024 * 1024 * 10 //图片最大限制
            var file = $(this).get(0).files[0] //文件对象
            var fileName = file.name //文件昵称
            // var srcc = window.URL.createObjectURL(file); //图片回显
            var suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
            if (['.jpeg', '.png', '.jpg', '.gif'].indexOf(suffix) == -1) { //不支持图片leixing 
                alert('请选择支持图片格式')
                return;
            }
            if (file.size > imgMaxSize) {
                //文件太大
                return;
            }
            _this.imgBase64(file)
            _this.submitImg(file)
            var len = $('.content .contextBox').length;
            _this.nowMySendMsg = len - 1
            $('.itemWrap').scrollTop($('.content .contextBox').get(len - 1).offsetTop)
            // _this.sendMsg()
            $(this).val('')
        })

    }
    this.appendNewMsg = function () {
        var _this = this;
        var html = "";
        $.ajax({
            url: "http://121.46.195.211:13888/delegate/msg/refresh/" + uid + "?",
            type: "POST",
            async: true,
            cache: true,
            dataType: "json",
            data: {
                limit: "",
                targetId: menId,
                token: token,
                lastId: _this.max
            },
            success: function (data) {
                console.log(data)
                html = _this.handleNewMsgHtml(data)
                kkkk.updateReplyLastMsg(uid, data);
                $(".content").append(html);
                console.log("---")
                console.log(html)
            }
        })
        return "";
    }
    this.handleNewMsgHtml = function (data) {
        var _this = this;
        var handleMSGhtml = "";
        for (var i = 0; i < data.content.length; i++) {
            if (data.content[i].id > _this.max) {
                if (data.content[i].id > _this.max) {
                    _this.max = data.content[i].id
                }
                var loway = data.content[i].content
                var tarid = data.content[i].content.int64_target_user_id
                var senid = data.content[i].content.int64_user_id
                handleMSGhtml += _this.addFun(loway, tarid, senid)
            }
        }
        return handleMSGhtml;
    }
    this.addFun = function (loway, tarid, senid) {
        var _this = this
        var handleMSGhtml = ""
        if (tarid == uid) { //接收的消息      targetid 等于 uid   接受消息得是我
            handleMSGhtml += _this.handleHtml.apdTime(_this.talkTime(loway.int64_time))
            if (loway.string_tp == "RC:TxtMsg") { //文本消息
                handleMSGhtml += _this.handleHtml.textMsg(menHead, loway.msg_user_private.string_content, {})
            } else if (loway.string_tp == "RC:VcMsg") { //语音消息
                handleMSGhtml += _this.handleHtml.audioMsg(menHead, loway.msg_user_audio.string_content, {}, loway.msg_user_audio.uint32_auido_duration)
            } else if (loway.string_tp == "RC:SightMsg") { //视频消息
                handleMSGhtml += _this.handleHtml.videoMsg(menHead, loway.msg_user_small_video.string_video_url, {})
            } else if (loway.string_tp == "RC:ImgMsg") { //图片
                handleMSGhtml += _this.handleHtml.imgMsg(menHead, loway.msg_user_image.string_image_url, {})
            } else if (loway.string_tp == "QI:FlatterMsg") { //搭讪礼物
                handleMSGhtml += _this.handleHtml.giftMsg(menHead, loway.msg_user_flatter.string_content, loway.msg_user_flatter.uint32_goods_num, loway.msg_user_flatter.uint32_goods_num, loway.msg_user_flatter.string_image_url, {}, "你")
            } else if (loway.string_tp == "QI:GiftMsg") { //送出礼物
                handleMSGhtml += _this.handleHtml.giftTMsg(menHead, loway.msg_user_goods.string_goods_name, loway.msg_user_goods.uint32_goods_num, {}, "你")
            }
        }
        if (senid == uid) { // 我发送消息
            handleMSGhtml += _this.handleHtml.mySengMsgTime(_this.talkTime(loway.int64_time))
            if (loway.string_tp == "RC:TxtMsg") {
                handleMSGhtml += _this.handleHtml.textMsg(_this.nvtou, loway.msg_user_private.string_content, {
                    a: "myContentBox",
                    b: "myhead",
                    c: "mytextBox",
                    d: "jiantouRight",
                })
            } else if (loway.string_tp == "RC:ImgMsg") {
                handleMSGhtml += _this.handleHtml.imgMsg(_this.nvtou, loway.msg_user_image.string_image_url, {
                    a: "myContentBox",
                    b: "myhead",
                    c: "mytextBox",
                    d: "jiantouRight",
                })
            } else if (loway.string_tp == "RC:VcMsg") {
                handleMSGhtml += _this.handleHtml.audioMsg(_this.nvtou, loway.msg_user_audio.string_content, {
                    a: "myContentBox",
                    b: "myhead",
                    c: "mytextBox",
                    d: "jiantouRight",
                }, loway.msg_user_audio.uint32_auido_duration)
            } else if (loway.string_tp == "RC:SightMsg") {
                handleMSGhtml += _this.handleHtml.videoMsg(_this.nvtou, loway.msg_user_small_video.string_video_url, {
                    a: "myContentBox",
                    b: "myhead",
                    c: "mytextBox",
                    d: "jiantouRight",
                })
            }
        }
        return handleMSGhtml;
    }
    //提交图片
    this.submitImg = function (file) {
        var _this = this;
        var formData = new FormData();
        formData.append('size', file.size)
        formData.append('name', file.name)
        formData.append('lastModifiedDate', file.lastModifiedDate)
        formData.append('file', file)
        formData.append('userId', uid)
        $.ajax({
            url: "http://files-upload.evkeji.cn/sns/files/upload/file/imvoice?",
            type: "post",
            dataType: "json",
            processData: false,
            contentType: false,
            data: formData,
            success: function (data) {
                // console.log(data)
                if (data.state == 0) {
                    _this.sendImgMsg(data.content.url)
                } else {
                    alert(data.message)
                }
            },
            error: function () {
                alert('服务器出了点小意外~')
            }
        })
    }
    //图片压缩转base64
    this.imgBase64 = function (file) {
        var reader = new FileReader()
        var img = new Image()
        reader.readAsDataURL(file)
        reader.onload = function (e) {
            img.src = e.target.result
        }
        img.onload = function () {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var originWidth = this.width;
            var originHeight = this.height;
            var maxWidth, maxHeight = 100;
            var targetWidth = originWidth,
                targetHeight = originHeight;
            if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                    // 更宽，按照宽度限定尺寸
                    targetWidth = maxWidth;
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                    targetHeight = maxHeight;
                    targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
            }
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
            //压缩后的图片转base64 url
            /* canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
             * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92*/
            Base64Img = canvas.toDataURL('image/jpeg', 0.92);
        }
    }
    //发送图片消息请求
    this.sendImgMsg = function (imgUrl) {
        var _this = this;
        $.ajax({
            url: "http://121.46.195.211:13888/delegate/msg/send/image/" + uid,
            type: "POST",
            dataType: "json",
            async: true,
            data: {
                mcheck: mcheck,
                content: Base64Img,
                imageUrl: imgUrl,
                targetId: menId
            },
            success: function (data) {
                // console.log(data)
                setTimeout(function () {
                    var htmlcontent = _this.appendNewMsg();
                    $('.content').append(_this.appendNewMsg(htmlcontent))
                }, 1000);
                if (data.state == 0) {
                    Base64Img = ""
                } else {
                    // alert('发送失败')
                }
            },
            error: function () {
                alert('服务器出了点小意外~')
            }
        })
    }
    //发送普通消息请求
    this.sendMsg = function (val) {
        var _this = this;
        $.ajax({
            url: "http://121.46.195.211:13888/delegate/msg/send/private/" + uid,
            type: "POST",
            dataType: "jsonp",
            cache: false,
            data: {
                mcheck: mcheck,
                content: val,
                targetId: menId
            },
            success: function (data) {
                // console.log(data)
                //$('.content').append(_this.appendNewMsg())
                _this.appendNewMsg()
                if (data.state == 0) {} else {
                    alert('发送失败')
                    $('.input').val(val)
                }
            },
            error: function () {
                alert('服务器出了点小意外~')
            }
        })
    }
    //点击图片放大图片
    this.tapImg = function () {
        $('.content').delegate('.text img', 'tap', function () {
            var srcc = $(this).attr('src')
            $('#bigImg').attr("src", srcc, )
            var windowW = $(window).width(); //获取当前窗口宽度
            var windowH = $(window).height(); //获取当前窗口高度
            var realWidth = this.width; //获取图片真实宽度
            var realHeight = this.height; //获取图片真实高度
            var imgWidth, imgHeight;
            var scale = 0.8; //缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
            if (realHeight > windowH * scale) {
                imgHeight = windowH * scale;
                imgWidth = imgHeight / realHeight * realWidth;
                if (imgWidth > windowW * scale) {
                    imgWidth = windowW * scale;
                }
            } else if (realWidth > windowW * scale) {
                imgWidth = windowW * scale;
                imgHeight = imgWidth / realWidth * realHeight;
            } else {
                imgWidth = realWidth;
                imgHeight = realHeight;
            }
            $('#bigImg').css("width", imgWidth * 1.1); //以最终的宽度对图片缩放
            $('.innerDiv').css({
                "top": '50%',
                "left": '50%',
                "transform": "transLate(-50% ,-50%)"
            });
            $('.bigImg').show("500");
        })
    }
    //点击关闭放大图片
    this.closeBigImg = function () {
        $('.bigImg').tap(function () {
            $(this).hide(500)
        })
    }
    //滚动条
    this.scroll = function () {
        var x = "";
        var _this = this;
        var _scroll = "";
        var _touch = "";
        var flag = true;

        $('.itemWrap').on('touchstart', function (e) {
            x = e.touches[0].clientY

        })
        $('.itemWrap').on('touchmove', function (e) {
            _touch = e.touches[0].clientY
            _scroll = $('.itemWrap').scrollTop()
            if (_scroll <= 0) {
                $('.itemWrap').css({
                    "transform": "transLateY(" + (_touch - x) / 3.5 + "px)",
                    "transition": "transform linear"
                })
            }
            var scrollHiddenTop = $('.itemWrap').css('transform').substr(11, 2)
            if (scrollHiddenTop >= 50) {
                if (flag) {
                    $.ajax({
                        url: "http://121.46.195.211:13888/delegate/msg/history/" + uid + "?",
                        type: "POST",
                        async: false,
                        cache: true,
                        dataType: "json",
                        data: {
                            limit: 100,
                            targetId: menId,
                            token: token,
                            lastId: _this.min
                        },
                        success: function (data) {
                            var min = 0;
                            // console.log(_this.min)
                            // console.log(data)
                            var handleMSGhtml = "";
                            data.content.reverse()
                            for (var i = 0; i < data.content.length; i++) {
                                if (data.content[i].id < _this.min) {
                                    // console.log('？')
                                    min = data.content[0].id
                                    // console.log(_this.min)
                                    var loway = data.content[i].content
                                    var tarid = data.content[i].content.int64_target_user_id
                                    var senid = data.content[i].content.int64_user_id
                                    handleMSGhtml += _this.addFun(loway, tarid, senid)
                                }

                            }
                            _this.min = min
                            $('.content').prepend(handleMSGhtml)
                            flag = false
                        }
                    })
                }
            }
            if (scrollHiddenTop <= 30) {
                flag = true
            }
        })
        $('.itemWrap').on('touchend', function (e) {
            if (_scroll <= 0) {
                $('.itemWrap').css({
                    "transform": "transLateY(0px)",
                    "transition": "transform .5s linear"
                })
            }
        })

    }

    this.newMsgHandle = function (len) {
        var num = $('.content .contextBox').eq(this.initLength - 1).offset().top;
        if (num < 560 && num > 0) {
            $('.itemWrap').scrollTop($('.content .contextBox').get(len - 1).offsetTop)
        }
        // this.audioLength()
        this.initLength = len
    }
}







//点击back按钮
$('.ListBack').tap(function () {
    if (istalk) {
        clearInterval(timer2)
        talkList.init()
        getNowTime()
        istalk = false
        $('.app').removeAttr('style')
        $('.input').val('')
    } else {
        // window.location.href = "http://123.57.87.160:80/cd/login.html";
        window.location.href = "http://192.168.25.126:8080/login.html";

    }
})

function isLoginOut() {
    if (!uid || !mcheck) {
        // window.location.href = "http://123.57.87.160:80/cd/login.html";
        window.location.href = "http://192.168.25.126:8080/login.html";
    }
}

















// var obj = $("#file");
// var fileName = obj.val(); //上传的本地文件绝对路径
// var suffix = fileName.substring(fileName.lastIndexOf("."), fileName.length); //后缀名
// var file = obj.get(0).files[0]; //上传的文件
// var size = file.size > 1024 ? file.size / 1024 > 1024 ? file.size / (1024 * 1024) > 1024 ? (file.size / (1024 * 1024 * 1024)).toFixed(2) + 'GB' : (file.size /
//     (1024 * 1024)).toFixed(2) + 'MB' : (file.size /
//     1024).toFixed(2) + 'KB' : (file.size).toFixed(2) + 'B'; //文件上传大小

// $.ajax({
//     type: 'post',
//     url: "/QiniuUpToken",
//     data: {
//         "suffix": suffix
//     },
//     dataType: 'json',
//     success: function (result) {
//         if (result.success == 1) {
//             var observer = { //设置上传过程的监听函数
//                 next(result) { //上传中(result参数带有total字段的 object，包含loaded、total、percent三个属性)
//                     Math.floor(result.total.percent); //查看进度[loaded:已上传大小(字节);total:本次上传总大小;percent:当前上传进度(0-100)]
//                 },
//                 error(err) { //失败后
//                     alert(err.message);
//                 },
//                 complete(res) { //成功后
//                     // ?imageView2/2/h/100：展示缩略图，不加显示原图
//                     // ?vframe/jpg/offset/0/w/480/h/360：用于获取视频截图的后缀，0：秒，w：宽，h：高
//                     $("#image").attr("src", result.domain + result.imgUrl + "?imageView2/2/w/400/h/400/q/100");
//                 }
//             };
//             var putExtra = {
//                 fname: "", //原文件名
//                 params: {}, //用来放置自定义变量
//                 mimeType: null //限制上传文件类型
//             };
//             var config = {
//                 region: qiniu.region.z2, //存储区域(z0:代表华东;z2:代表华南,不写默认自动识别)
//                 concurrentRequestLimit: 3 //分片上传的并发请求量
//             };
//             var observable = qiniu.upload(file, result.imgUrl, result.token, putExtra, config);
//             var subscription = observable.subscribe(observer); // 上传开始
//             // 取消上传
//             // subscription.unsubscribe();
//         } else {
//             alert(result.message); //获取凭证失败
//         }
//     },
//     error: function () { //服务器响应失败处理函数
//         alert("服务器繁忙");
//     }
// });