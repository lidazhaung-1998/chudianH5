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

var falseData = [{
        mysendmsg: false,
        text: "hello，小姐姐",
        audio: "",
        video: "",
        image: "",
        gift: "",
        scorce: ""
    }, {
        mysendmsg: false,
        text: "",
        audio: "",
        image: "",
        video: "",
        gift: "玫瑰花",
        num: "1",
        scorce: "+1"
    }, {
        mysendmsg: true,
        text: "帅哥，你好",
        audio: "",
        video: "",
        image: "",
        gift: "",
        scorce: "+0.4"
    },
    {
        mysendmsg: false,
        text: "",
        audio: "https://alibaba-resource.evkeji.cn/files/uservoice/20200509/430288131/430288131-1589002701_1260.mp3",
        image: "",
        video: "",
        gift: "",
        scorce: ""
    },
    {
        mysendmsg: false,
        text: "",
        audio: "https://alibaba-resource.evkeji.cn/files/uservoice/20200507/430392564/430392564-1588836917_1042.mp3",
        image: "",
        video: "",
        gift: "",
        scorce: ""
    },
    {
        mysendmsg: false,
        text: "",
        audio: "",
        video: "http://page.qxiu.com/ldz/static/test.mp4",
        image: "",
        gift: "",
        scorce: ""
    },
    {
        mysendmsg: false,
        text: "",
        audio: "",
        video: "http://page.qxiu.com/ldz/static/test2.mp4",
        image: "",
        gift: "",
        scorce: ""
    },
    {
        mysendmsg: true,
        text: "帅哥，你好酷",
        audio: "",
        video: "",
        image: "",
        gift: "",
        scorce: "+0.6"
    },
    {
        mysendmsg: true,
        text: "",
        audio: "",
        video: "",
        image: bbb,
        gift: "",
        scorce: "+10"
    },
]
isLoginOut()
var talkList = new TalkList()
talkList.init() //好友列表页
var intalk = new Intalk()
var inTalk = false

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

function TalkList() {
    this.scrollT = 0;
    this.init = function () {
        this.renderUserList(arr1)
        this.outTalkHtml()
        this.clickListItem()
        this.scrollPosition()
    }
    this.scrollPosition = function () {
        this.scrollT == 0 ? $('.content').scrollTop(0) : $('.content').scrollTop(this.scrollT)
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
        var _this = this;
        $('.item').tap(function () {
            istalk = true //区分是退出到好友列表页or退出好友列表页
            menId = $(this).find('.hiddenUserid').html()
            _this.scrollT = $('.content').scrollTop()
            intalk.init() //进入聊天界面构造函数
            inTalk = true
        })
    }

}
var newmsg = [{
    mysendmsg: false,
    text: "Can i sleep with you tonight?",
    audio: "",
    video: "",
    image: "",
    gift: "",
    scorce: ""
}]

var timer = "";
var timer2 = "";


// 聊天界面
function Intalk() {
    this.menNickName = "";
    this.initLength = 0;
    this.nantou = "";
    this.nvtou = `style="background-image:url(${myHead});"`
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
        audioMsg: function (head, audio, my) {
            var audioHtml = `<li class="contextBox ${my.a}">
                                <div class="head ${my.b}" ${head}></div>
                                <div class="textBox ${my.c}">
                                    <div class="jiantouLeft ${my.d}"></div>
                                    <div class="text"> <div class="audioTime"></div> <audio src="${audio}" controls></audio></div>
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
        }

    }
    this.init = function () {
        $('.content').html('')
        this.falseData = falseData;
        this.getUserMsg() //获取用户信息
        this.goingTalk() //进入聊天页更改的页面样式已经title
        this.renderTalkHtml() //渲染聊天记录
        this.initLength = $('.content .contextBox').length
        this.handleVideo()
        this.getHuashu() //获取话术
        this.audioLength() // 
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
        $('.content').scrollTop($('.content .contextBox').get(this.initLength - 1).offsetTop)

        timer2 = setInterval(function () {
            console.log('timer2')
            //     var tpl = _this.whoMsg(newmsg);
            //     $('.itemWrap .content').append(tpl)
            //     var newLength = $('.content .contextBox').length;
            //     if (newLength > _this.initLength) {
            //         _this.newMsgHandle(newLength)
            //     }
        }, 3000)
        timer = setTimeout(function () {
            console.log('timer')
            //     newmsg.push({
            //         mysendmsg: false,
            //         text: "",
            //         audio: "",
            //         video: "http://page.qxiu.com/ldz/static/test2.mp4",
            //         image: "",
            //         gift: "",
            //         scorce: ""
            //     }, {
            //         mysendmsg: true,
            //         text: "sure, But can you let me fly feel?",
            //         audio: "",
            //         video: "",
            //         image: "",
            //         gift: "",
            //         scorce: "+0.6"
            //     }, {
            //         mysendmsg: false,
            //         text: "",
            //         audio: "https://alibaba-resource.evkeji.cn/files/uservoice/20200509/430288131/430288131-1589002701_1260.mp3",
            //         video: "",
            //         image: "",
            //         gift: "",
            //         scorce: ""
            //     })
        }, 6000)
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
                _this.nantou = `style="background-image:url(${data.content[menId].head});"`
                _this.menNickName = data.content[menId].nickname
            }
        })
    }
    this.goingTalk = function () {
        $('.accountDefaultStyle').addClass('accountName');
        $('.mymessage').css('display', 'block')
        $('.title').addClass('istalk')
        $('footer').css('display', 'flex')
        $('.itemWrap').addClass('talkPage')
        $('.title .accountDefaultStyle').addClass("accountName").html(this.menNickName)
        $('.title .mymessage').html("我的资料 : " + myMSG)
    }
    this.renderTalkHtml = function () {
        $('.itemWrap .content').html($('.itemWrap .content').html() + this.whoMsg(this.falseData))
    }
    this.whoMsg = function (falseData) {
        var _this = this;
        var html = "";
        $.each(falseData, function (index, item) {
            if (!item.mysendmsg) { //接收的消息
                if (item.text) { //文本消息
                    html += _this.handleHtml.textMsg(_this.nantou, item.text, {})
                } else if (item.audio) { //语音消息
                    html += _this.handleHtml.audioMsg(_this.nantou, item.audio, {})
                } else if (item.video) { //视频消息
                    html += _this.handleHtml.videoMsg(_this.nantou, item.video, {})
                } else if (item.image) { //图片
                    html += _this.handleHtml.imgMsg(_this.nantou, item.image, {})
                } else { //送出礼物
                    html += _this.handleHtml.giftMsg(_this.nantou, item.gift, item.num, item.scorce, {})
                }
            } else { //我发送的消息
                if (item.text) {
                    html += _this.handleHtml.textMsg(_this.nvtou, item.text, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                        e: item.scorce
                    })
                } else if (item.image) {
                    html += _this.handleHtml.imgMsg(_this.nvtou, item.image, {
                        a: "myContentBox",
                        b: "myhead",
                        c: "mytextBox",
                        d: "jiantouRight",
                        e: item.scorce
                    })
                }
            }
        })
        return html
    }
    this.isAudio = function () {
        //播放音频按下事件
        $('.content').delegate('.textBox', 'touchstart', function () {
            var item = $(this).find('.text audio')[0]
            if (!item) {
                return;
            }
            $(this).css("background", '#ccc')
            $(this).find('.jiantouLeft').css({
                "border-right": ".15rem solid #ccc"
            })
            if (item.paused) { //没播放
                $('.text').find('audio').each(function (index, list) {
                    list.pause()
                    list.currentTime = 0
                })
                item.play()
            } else { //播放中
                item.pause()
            }
        })
        //播放音频抬起事件
        $('.content').delegate('.textBox', 'touchend', function () {
            var item = $(this).find('.text audio')[0]
            if (!item) {
                return;
            }
            var _this = $(this)
            setTimeout(function () {
                _this.css("background", '#fff')
                _this.find('.jiantouLeft').css({
                    "border-right": ".15rem solid #fff"
                })
            }, 300)
        })
    }
    this.audioLength = function () {
        $('.text audio').on('durationchange', function () {
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
            clearTimeout(timer)
            var inp = $('.input')
            var val = inp.val()
            $('.content').append(_this.handleHtml.textMsg(_this.nvtou, val, {
                a: "myContentBox",
                b: "myhead",
                c: "mytextBox",
                d: "jiantouRight",
            }))
            inp.val('')
            var len = $('.content .contextBox').length;
            $('.content').scrollTop($('.content .contextBox').get(len - 1).offsetTop)
            //发起请求
            set
        })
        $('.inputFile').on('change', function () {
            var imgMaxSize = 1024 * 1024 * 10 //图片最大限制
            var file = $(this).get(0).files[0] //文件对象
            var fileName = file.name //文件昵称
            var srcc = window.URL.createObjectURL(file); //图片回显
            var suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
            console.log(file)
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
            var addImgHtml = $(`
                    <li class="contextBox myContentBox">
                        <div class="head myhead" ${_this.nvtou}></div>
                        <div class="textBox mytextBox mySendImg">
                            <div class="text">
                                <img src="${srcc}" alt="">
                            </div>
                        </div>
                    </li>`)
            $('.content').append(addImgHtml)
            var len = $('.content .contextBox').length;
            $('.content').scrollTop($('.content .contextBox').get(len - 1).offsetTop)
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
            console.log(imgWidth)
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
    this.handleVideo = function () {

        $('.content .text video').on('loadeddata', function () {

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
            _scroll = $('.content').scrollTop()
            if (_scroll <= 0) {
                $('.content').css({
                    "transform": "transLateY(" + (_touch - x) / 3 + "px)",
                    "transition": "transform linear"
                })
            }
            var scrollHiddenTop = $('.content').css('transform').substr(11, 2)
            if (scrollHiddenTop > 50) {

            }
        })
        $('.itemWrap').on('touchend', function (e) {
            if (_scroll <= 0) {
                $('.content').css({
                    "transform": "transLateY(0px)",
                    "transition": "transform .3s linear"
                })
            }
        })

    }

    this.newMsgHandle = function (len) {
        var num = $('.content .contextBox').eq(this.initLength - 1).offset().top;
        if (num < 560 && num > 0) {
            $('.content').scrollTop($('.content .contextBox').get(len - 1).offsetTop)
        }
        this.audioLength()
        this.initLength = len
    }
}







//点击back按钮
$('.ListBack').tap(function () {
    if (istalk) {
        clearTimeout(timer)
        clearInterval(timer2)
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

















// var obj = $("#file");
// var fileName = obj.val(); //上传的本地文件绝对路径
// var suffix = fileName.substring(fileName.lastIndexOf("."), fileName.length); //后缀名
// var file = obj.get(0).files[0]; //上传的文件
// var size = file.size > 1024 ? file.size / 1024 > 1024 ? file.size / (1024 * 1024) > 1024 ? (file.size / (1024 * 1024 * 1024)).toFixed(2) + 'GB' : (file.size /
//     (1024 * 1024)).toFixed(2) + 'MB' : (file.size /
//     1024).toFixed(2) + 'KB' : (file.size).toFixed(2) + 'B'; //文件上传大小
// //七牛云上传
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







//     var html = `<li class="contextBox">
//     <div class="head" ${nantou}></div>
//     <div class="textBox">
//         <div class="jiantouLeft"></div>
//         <div class="text"><span>和代好爱上大搜爱神的箭你扫地哈斯迪欧hi殴打扫黄按属地欧萨哄你集的京东is啊</span></div>
//     </div>
// </li>
// <li class="contextBox">
//     <div class="head"></div>
//     <div class="textBox">
//         <div class="jiantouLeft"></div>
//         <div class="text">送你礼物 <span>玫瑰花x1</span><span class="yColor">  +1积分</span></div>
//     </div>
// </li>
// <li class="contextBox myContentBox">
//     <div class="head myhead" style="background-image:url(${myHead});"></div>
//     <div class="textBox mytextBox">
//         <div class="jiantouLeft jiantouRight"></div>
//         <div class="text"><span>和代好爱上大搜爱神的箭你扫地哈斯迪欧hi殴打扫黄按属地欧萨哄你集的京东is啊</span></div>
//         <div class="pScorce">+0.4积分</div>
//     </div>
// </li>

// <li class="talkTime">
//     <div class="date">今天 下午 05:34</div>
// </li>

// <li class="contextBox">
//     <div class="head"></div>
//     <div class="textBox">
//         <div class="jiantouLeft"></div>
//         <div class="text"> <div class="audioTime"></div> <audio src="https://alibaba-resource.evkeji.cn/files/uservoice/20200509/430288131/430288131-1589002701_1260.mp3" controls></audio></div>
//     </div>
// </li>


// <li class="contextBox">
//     <div class="head"></div>
//     <div class="textBox">
//         <div class="jiantouLeft"></div>
//         <div class="text"> <div class="audioTime"></div> <audio src="https://alibaba-resource.evkeji.cn/files/uservoice/20200507/430392564/430392564-1588836917_1042.mp3" controls></audio></div>
//     </div>
// </li>

// <li class="contextBox">
//     <div class="head"></div>
//     <div class="textBox">
//         <div class="jiantouLeft"></div>
//         <div class="text">  <video class="video" src="http://page.qxiu.com/ldz/static/test.mp4" webkit-playsinline="allow" playsinline="allow" x5-playsinline="allow" x-webkit-airplay="allow" controls></video></div>
//     </div>
// </li>

// <li class="contextBox">
//     <div class="head"></div>
//     <div class="textBox">
//         <div class="jiantouLeft"></div>
//         <div class="text"><video class="video" src="http://page.qxiu.com/ldz/static/test2.mp4" webkit-playsinline="allow" playsinline="allow" x5-playsinline="allow" x-webkit-airplay="allow"  controls></video></div>
//     </div>
// </li>

// <li class="contextBox">
//     <div class="head"></div>
//     <div class="textBox">
//         <div class="jiantouLeft"></div>
//         <div class="text">
//             <img src="${bbb}" alt="">
//         </div>
//     </div>
// </li>`