import "../css/index.scss";
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
var token = cookie.get('token')
var menId, menName, menHead = ""; //男性账号
var istalk = false; //判断是否在聊天页


isLoginOut()

var intalk = new Intalk()
var inTalk = false
var maxid, lastmsg, lasttext, obj, menAllId, msgLength, oldid, lastMsgTime, loop = null
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
        var _this = this;
        this.upData()
        timerUpdata = setInterval(function () {
            _this.upData()
        }, 2000)
        this.outTalkHtml()
        this.scrollPosition()
        this.dashanhuifu()

    }
    this.upData = function () {
        var _this = this;
        $.ajax({
            url: "http://121.201.62.233:13888/delegate/msg/refresh/" + uid,
            type: "POST",
            async: false,
            data: {
                limit: "",
                targetId: "",
                lastId: maxid,
                token: token
            },
            success: function (data) {
                bl = true
                for (var i = 0; i < data.content.length; i++) {
                    if (data.content[i].id > maxid) {
                        maxid = data.content[i].id
                        if (_this.flag) {
                            _this.handleArray(data.content)
                            _this.renderUserList()
                            _this.clickListItem()
                            _this.flag = false
                        } else {
                            if (bl) {
                                _this.newMsg(data.content)
                                _this.renderUserList()
                                _this.clickListItem()
                            }
                        }
                    }
                }

            }
        })
    }
    this.handleArray = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            // 发送者消息接收者是当前虚拟女号得id才是正确未读消息
            if (obj[arr[i].content.int64_user_id]) {
                obj[arr[i].content.int64_user_id]++
            } else {
                obj[arr[i].content.int64_user_id] = 1
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
                url: "http://121.201.62.233:13888/delegate/msg/refresh/" + uid,
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
                    }
                    if (data.content[0].content.int64_user_id == uid) {
                        lastmsg[i] = '已回复'
                    }
                }
            })
        }
        lastmsg = lastmsg.reverse()
    }
    this.newMsg = function (newArr) {
        menAllId = []
        msgLength = []
        loop = []
        lastMsgTime = []
        console.log(newArr)
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
        console.log(obj)
        this.lastMSGData()
        msgLength = msgLength.reverse()
        menAllId = menAllId.reverse()
        lastMsgTime = lastMsgTime.reverse()
        // console.log(menAllId)
        // console.log(msgLength)
        // console.log(lastMsgTime)
        bl = false

    }
    this.renderUserList = function () {
        var html = '';
        if (maxid > oldid) {
            $.each(menAllId, function (index, item) {
                $.ajax({
                    url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    cache: true,
                    data: {
                        userIds: item
                    },
                    success: function (data) {
                        html += ` <li class="item border-1px EverylastBorderDone">
                            <div class="hiddenUserid" style="display:none;">${item}</div>
                            <div class="taskIcon" style="background-image:url(${data.content[item].head});"></div>
                            <div class="hiddenHead" style="display:none;">${data.content[item].head}</div>
                            <div class="hiddenName" style="display:none;">${data.content[item].nickname}</div>
                            <div class="taskContent">
                                <div class="taskName">${data.content[item].nickname}</div>
                                
                                <div class="taskContext">
                                    <span class="message">
                                   ${lastmsg[index]} <span>
                                </div>
                            </div>
                            <div class="contentWrap">
                                <div class="redIcon">
                                     ${compileTime(lastMsgTime[index])}
                                    </div>
                                <div class="plusMoney">
                                    <span class="xiaoxi">${msgLength[index]}</span>
                                </div>
    
                            </div>
                        </li>`
                    }
                })

            })
        }
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
    this.dashanhuifu = function () {
        $.each($('.message'), function (index, item) {
            if (item.innerText == "搭讪消息") {
                var needSengID = $('.hiddenUserid').eq(index).html()
                console.log(needSengID)
                $.ajax({
                    url: "http://121.201.62.233:13888/delegate/res/quickreplylist/" + uid,
                    type: "POST",
                    dataType: "json",
                    async: true,
                    success: function (req) {
                        // console.log(req)
                        var val = req.content[0]
                        // $.ajax({
                        //     url: "http://121.201.62.233:13888/delegate/msg/send/private/" + uid,
                        //     async: true,
                        //     dataType: "jsonp",
                        //     data: {
                        //         mcheck: "",
                        //         content: encodeURIComponent(val),
                        //         targetId: needSengID
                        //     },
                        //     success: function () {

                        //     }

                        // })
                    }
                })
            }
        })
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
            intalk.init() //进入聊天界面构造函数
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
                                    <div class="text"> <div class="audioTime">${time}s</div> <audio src="${audio}" controls></audio>
                                        <source src="" type="audio/mpeg">
                                    </div>
                                </div>
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
        giftMsg: function (head, gift, num, scorce, my) {
            var giftHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                <div class="textBox ${my.c}">
                                <div class="jiantouLeft"></div>
                                <div class="text">送你礼物 <span>${gift + "x" + num}</span><span class="yColor">  ${scorce}积分</span></div>
                                </div>
                            </li>`
            return giftHtml
        },
        giftTMsg: function (head, gift, num, scorce, my) {
            var giftHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                <div class="textBox ${my.c}">
                                <div class="jiantouLeft"></div>
                                <div class="text">送你礼物 <span>${gift + "x" + num}</span><span class="yColor">  ${scorce}积分</span></div>
                                </div>
                            </li>`
            return giftHtml
        },
        apdTime: function (date) {
            var dateHtml = `<li class="talkTime">
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

        var _this = this
        if (!inTalk) {
            this.isAudio() //是音频做出相应处理
            this.tapImg()
            this.choseImg() //点击选择图片
            this.tapHuashu() //点击选中话术
            this.tapSendMsg() //点击发送
            this.scroll()
            this.closeBigImg()
        }
        setTimeout(function () {
            $('.itemWrap').scrollTop($('.content').height() + 1000)
        }, 1000)

        timer2 = setInterval(function () {
            _this.appendNewMsg()
        }, 3000)

    }
    this.getTalkMsg = function () {
        var self = this;
        $.ajax({
            url: "http://121.201.62.233:13888/delegate/msg/refresh/" + uid + "?",
            type: "POST",
            async: false,
            cache: true,
            dataType: "json",
            data: {
                limit: "",
                targetId: menId,
                token: token,
                lastId: 0
            },
            success: function (data) {
                for (var i = 0; i < data.content.length; i++) {
                    if (data.content[i].id > self.max) {
                        self.max = data.content[i].id
                    }
                }
                console.log(data)
                console.log(self.max)
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
        $('.title .mymessage').html("我的资料 : " + myMSG)
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
            if(index <= 0) {
                html += _this.handleHtml.apdTime(_this.talkTime(item.content.int64_time))
            }
            
            if (index < falseData.length - 2) {
                if (falseData[index + 1].content.int64_time - falseData[index].content.int64_time > 600000) {
                    html += _this.handleHtml.apdTime(_this.talkTime(falseData[index].content.int64_time))
                } //600000
            }
            // if (falseData.length < 5) {
            //     html = _this.handleHtml.apdTime(_this.talkTime(falseData[index].content.int64_time))
            // }
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
                    html += _this.handleHtml.giftMsg(menHead, loway.msg_user_flatter.string_content, loway.msg_user_flatter.uint32_goods_num, loway.msg_user_flatter.uint32_goods_num, {})
                } else if (loway.string_tp == "QI:GiftMsg") {
                    html += _this.handleHtml.giftTMsg(menHead, loway.msg_user_goods.int64_goods_id, loway.msg_user_goods.uint32_goods_num, loway.msg_user_goods.uint32_goods_num, {})
                }

            }
            if (sendid == uid) { //我发送的消息               sendid 等于 uid  发送消息的是我
                if (loway.string_tp == "RC:TxtMsg") {
                    html += _this.handleHtml.textMsg(_this.nvtou, loway.msg_user_private.string_content, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                        e: 1
                    })
                } else if (loway.string_tp == "RC:ImgMsg") {
                    html += _this.handleHtml.imgMsg(_this.nvtou, loway.msg_user_image.string_image_url, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                        e: 1
                    })
                } else if (loway.string_tp == "RC:VcMsg") {
                    html += _this.handleHtml.audioMsg(_this.nvtou, loway.msg_user_audio.string_content, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                        e: 1
                    }, loway.msg_user_audio.uint32_auido_duration)
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
                return;
            }
            let audio = new Audio;
            audio.src = item.getAttribute('src')
            audio.play()
            $(this).css("background", '#ccc')
            $(this).find('.jiantouLeft').css({
                "border-right": ".15rem solid #ccc"
            })
            // if (item.paused) { //没播放
            //     $('.text').find('audio').each(function (index, list) {
            //         list.pause()
            //         list.currentTime = 0
            //     })
            //     item.play()
            // } else { //播放中
            //     item.pause()
            // }
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
    this.audioLength = function () {
        $('.text audio').on('durationchange', function () {
            console.log('???')
            var duration = parseInt($(this)[0].duration)
            $(this).prev('.audioTime').html(duration + "s")
            if (duration >= 0 && duration <= 3) {
                $(this).css('width', '1rem')
            } else if (duration > 3 && duration <= 5) {
                $(this).css('width', '1.2rem')
            } else if (duration > 5 && duration <= 10) {
                $(this).css('width', '1.5rem')
            } else if (duration > 10 && duration <= 20) {
                $(this).css('width', '1.9rem')
            } else if (duration > 20 && duration <= 30) {
                $(this).css('width', '2.5rem')
            } else if (duration > 30 && duration <= 40) {
                $(this).css('width', '3rem')
            } else if (duration > 40 && duration <= 50) {
                $(this).css('width', '4rem')
            } else {
                $(this).css('width', '4.5rem')
            }
        })
    }
    this.choseImg = function () {
        $('.click').on('touchstart', function () {

            $(this).css("background", "#ccc")
            if ($(this).hasClass('checkImg')) {

            } else {
                //按下的是快捷话语
                $('.huashu').fadeIn(500).css('display', 'flex')
            }
        })
        $('.click').on('touchend', function () {
            $(this).css("background", "none")
        })
        $('.cancel').tap(function () {
            $('.huashu').fadeOut(500)
        })
    }
    //获取话术
    this.getHuashu = function () {
        var huashuHtml = "";
        $.ajax({
            url: "http://121.201.62.233:13888/delegate/res/quickreplylist/" + uid,
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
        $('.huashu_text').on('tap', function () {
            console.log('2')
            $('.inputBox .input').val($(this).html())
        })
        $('.huashu_text').on('touchend', function () {
            var _this = $(this)
            $(this).css("background", "#999")
            setTimeout(function () {
                _this.css("background", "none")
            }, 500)
            $('.huashu').fadeOut(500)
        })
    }

    this.tapSendMsg = function () {
        var _this = this;
        $('.sendmsgbox').tap(function () {
            //请求发送消息前先停止掉消息获取
            clearInterval(timer2)
            var inp = $('.input')
            var val = inp.val()
            _this.sendMsg(encodeURIComponent(val))

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
            var srcc = window.URL.createObjectURL(file); //图片回显
            var suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
            if (['.jpeg', '.png', '.jpg'].indexOf(suffix) == -1) { //不支持图片leixing 
                // 定义报错
                return;
            }
            if (file.size > imgMaxSize) {
                //文件太大
                return;
            }
            var formData = new FormData();
            formData.append('type', file.type)
            formData.append('size', file.size)
            formData.append('name', file.name)
            formData.append('lastModifiedDate', file.lastModifiedDate)
            formData.append('file', file)
            $('.content').append(_this.handleHtml.imgMsg(_this.nvtou, srcc, {
                a: "myContentBox",
                b: "myhead",
                c: "mytextBox",
                d: "jiantouRight",
            }))
            var len = $('.content .contextBox').length;
            _this.nowMySendMsg = len - 1
            $('.itemWrap').scrollTop($('.content .contextBox').get(len - 1).offsetTop)
            _this.sendMsg()
            $(this).val('')
        })

    }
    this.appendNewMsg = function () {
        var _this = this;
        $.ajax({
            url: "http://121.201.62.233:13888/delegate/msg/refresh/" + uid + "?",
            type: "POST",
            async: false,
            cache: true,
            dataType: "json",
            data: {
                limit: "",
                targetId: menId,
                token: token,
                lastId: _this.max
            },
            success: function (data) {
                var html = "";
                console.log(data)
                for (var i = 0; i < data.content.length; i++) {
                    if (data.content[i].id > _this.max) {
                        if (data.content[i].id > _this.max) {
                            _this.max = data.content[i].id
                        }

                        var loway = data.content[i].content
                        var tarid = data.content[i].content.int64_target_user_id
                        var senid = data.content[i].content.int64_user_id
                        if (tarid == uid) { //接收的消息      targetid 等于 uid   接受消息得是我
                            if (loway.string_tp == "RC:TxtMsg") { //文本消息
                                html += _this.handleHtml.textMsg(menHead, loway.msg_user_private.string_content, {})
                            } else if (loway.string_tp == "RC:VcMsg") { //语音消息
                                html += _this.handleHtml.audioMsg(menHead, loway.msg_user_audio.string_content, {}, loway.msg_user_audio.uint32_auido_duration)
                            } else if (loway.string_tp == "RC:SightMsg") { //视频消息
                                html += _this.handleHtml.videoMsg(menHead, loway.msg_user_small_video.string_video_url, {})
                            } else if (loway.string_tp == "RC:ImgMsg") { //图片
                                html += _this.handleHtml.imgMsg(menHead, loway.msg_user_image.string_image_url, {})
                            } else if (loway.string_tp == "QI:FlatterMsg") { //送出礼物
                                html += _this.handleHtml.giftMsg(menHead, loway.msg_user_flatter.string_content, loway.msg_user_flatter.uint32_goods_num, loway.msg_user_flatter.uint32_goods_num, {}, )
                            } else if (loway.string_tp == "QI:GiftMsg") {
                                html += _this.handleHtml.giftTMsg(menHead, loway.msg_user_goods.int64_goods_id, loway.msg_user_goods.uint32_goods_num, loway.msg_user_goods.uint32_goods_num, {})
                            }
                        }
                        if (senid == uid) { // 我发送消息
                            if (loway.string_tp == "RC:TxtMsg") {
                                html += _this.handleHtml.textMsg(_this.nvtou, loway.msg_user_private.string_content, {
                                    a: "myContentBox",
                                    b: "myhead",
                                    c: "mytextBox",
                                    d: "jiantouRight",
                                    e: 1
                                })
                            } else if (loway.string_tp == "RC:ImgMsg") {
                                html += _this.handleHtml.imgMsg(_this.nvtou, loway.msg_user_image.string_image_url, {
                                    a: "myContentBox",
                                    b: "myhead",
                                    c: "mytextBox",
                                    d: "jiantouRight",
                                    e: 1
                                })
                            } else if (loway.string_tp == "RC:VcMsg") {
                                html += _this.handleHtml.audioMsg(_this.nvtou, loway.msg_user_audio.string_content, {
                                    a: "myContentBox",
                                    b: "myhead",
                                    c: "mytextBox",
                                    d: "jiantouRight",
                                    e: 1
                                }, loway.msg_user_audio.uint32_auido_duration)
                            } else if (loway.string_tp == "RC:SightMsg") {
                                html += _this.handleHtml.videoMsg(_this.nvtou, loway.msg_user_small_video.string_video_url, {
                                    a: "myContentBox",
                                    b: "myhead",
                                    c: "mytextBox",
                                    d: "jiantouRight",
                                    e: 1
                                })
                            }
                        }
                    }
                }
                $('.content').append(html)

                // self.renderTalkHtml(data.content.reverse())
            }
        })
    }
    this.sendMsg = function (val) {
        var _this = this;
        $.ajax({
            url: "http://121.201.62.233:13888/delegate/msg/send/private/" + uid,
            type: "POST",
            dataType: "jsonp",
            cache: false,
            data: {
                mcheck: "64f712eff44e63453cbfdc8bb4936a586d95ced6e6a400a4d2602b14d0677f39",
                content: val,
                targetId: menId
            },
            success: function (data) {
                console.log(data)
                _this.appendNewMsg()
                if (data.state == 0) {

                } else {
                    alert('发送失败')
                    $('.input').val(decodeURIComponent(val))
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
            $('.bigImg').fadeIn("500");
        })
    }
    this.closeBigImg = function () {
        $('.bigImg').tap(function () {
            $(this).fadeOut(500)
        })
    }
    //滚动条
    this.scroll = function () {
        var x = "";
        var _scroll = "";
        var _touch = "";
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
            if (scrollHiddenTop > 50) {

            }
        })
        $('.itemWrap').on('touchend', function (e) {
            if (_scroll <= 0) {
                $('.itemWrap').css({
                    "transform": "transLateY(0px)",
                    "transition": "transform .3s linear"
                })
            }
        })

    }

    this.newMsgHandle = function (len) {
        var num = $('.content .contextBox').eq(this.initLength - 1).offset().top;
        if (num < 560 && num > 0) {
            $('.itemWrap').scrollTop($('.content .contextBox').get(len - 1).offsetTop)
        }
        this.audioLength()
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
    } else {
        window.location.href = "http://192.168.25.126:8080/login.html"
    }
})

function isLoginOut() {
    if (!uid || !mcheck) {
        window.location.href = "http://192.168.25.126:8080/login.html"
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