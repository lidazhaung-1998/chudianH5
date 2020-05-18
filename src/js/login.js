var $ = require('../libs/zepto')
var backIcon = require('../img/back.png')
var md5 = require('../libs/md5.js')
import "../css/login.scss"
import sha1 from "../libs/sha1"

document.onreadystatechange = completeLoading;

function completeLoading() {
    if (document.readyState == "complete") {
        $('.loading').css('display', 'none')
    } else {
        $('.loading').css('display', 'block')
    }
}
completeLoading()
$(function () {

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
    var md5String = "";
    var userName = "";
    var passWord = "";
    var token = "";
    $('.login').tap(function () {
        userName = $('.username').val()
        passWord = $('.password').val()
        md5String = md5(passWord);
        isLoginSucc()
        storageLoginStatus()
        // $('.loading').css('display','none')

    })

    function loginController() {
        var ControllerData = {}
        $.ajax({
            url: "http://121.201.62.233:13888/delegate/login?",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                username: userName || cookie.get('account'),
                password: md5String || cookie.get('pwd')
            },
            success: function (response) {
                console.log(response)
                if (response.content) {
                    token = response.content.token;
                }
                ControllerData = response
            },
            error: function (err) {
                alert('服务器出了点小意外~')
            }
        })
        return ControllerData;
    }

    isLogin()

    function isLogin() {
        if (!cookie.get('pwd') && !cookie.get('account')) {
            return;
        }
        //已经登录在这里调用接口获取实际的APP手机号和密码
        isLoginSucc()
    }

    function isLoginSucc() {
        var response = loginController()
        if (response.state == 0) {
            var loginSuc = new LoginSuc()
            loginSuc.init(response.content.appAccounts) //从这里把20个账户密码传到构造函数中过去
        } else {
            alert(response.message)
        }
    }

    function LoginSuc() {
        this.flag = false;
        this.userAccount = [] // 该数组存储  20个账户和密码
        this.userids = [] // 该数组存储  20个账户的userid
        this.userContentSelf = []
        this.init = function (arr) {
            this.userAccount = arr
            // 接受到传过来的20个账户密码并赋值
            this.getUserId()
            this.getuserContet()
            this.success()
            this.tapBack()
            this.clickListItem()
            this.getMsg()
        }
        // 遍历循环登录20个账户和密码
        this.getUserId = function () {
            var self = this;
            // 调用此处拿到20个账户id和meckeck
            $.each(this.userAccount, function (index, item) {
                // $.ajax({
                //     url: "http://cgi-user.evkeji.cn/mobileuser/user/phonelogin?", // 登录接口
                //     type: "POST",
                //     dataType: 'jsonp',
                //     async: false,
                //     data: {
                //         phone: 13716156938,
                //         password: 123456,
                //         _expire: new Date().getTime().toString(),
                //         sign: "39bf77e8305dd53ec145b84a38121dc75a9dda64",
                //         logintype: "1",
                //         code: "",
                //     },
                //     success: function (data) {
                //         console.log(data)
                //         self.userids.push(data.content.userid)
                //         // 拿到20个账号的“id”
                //     }
                // })
            })
            //http://cgi-user.evkeji.cn/mobileuser/user/phonelogin?phone=&logintype=1&password=123456&code=&_expire=1589358921956&sign=69B82F63757725E52EEE972A3C1A69C95341F9CA
            this.userids = [430022123, 430455137, 430014598, 430392564, 431294739, 431418282, 431820761, 430932358, 430699640, 430288131, 430325806, 430003799, 431448474,
                430890595, 430015571, 431685336, 431423069, 430895562, 431276446, 430392564
            ]
        }

        // 拿到userid后调用查询用户资料，查询20个用户资料
        this.getuserContet = function () {
            var self = this;
            $.each(this.userids, function (index, userid) {
                $.ajax({
                    url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    cache: true,
                    data: {
                        userIds: userid
                    },
                    success: function (data) {
                        console.log(data)
                        self.userContentSelf.push(data.content[userid])
                    }
                })
            })
        }
        this.success = function () {
            $('.title').html(` <div class="ListBack"><img src="${backIcon}" alt=""></div>
        账号列表`), $('.loginWrap').css('display', 'none');
            $('.itemWrap').css('display', 'block');
            this.renderList() //渲染账户列表html
        }
        this.tapBack = function () {
            var self = this
            $('.ListBack').tap(function () {
                self.reloadLogin()
            })
        }
        // 退出登录
        this.reloadLogin = function () {
            $('.title').html('账号登录'), $('.loginWrap').css('display', 'block');
            $('.itemWrap').css('display', 'none')
            cookie.remove('pwd')
            cookie.remove('account')
        }


        this.renderList = function () {
            var self = this;
            var accountHtml = "";
            $.each(this.userContentSelf, function (index, item) {
                accountHtml += ` <dl class="item border-1px EverylastBorderDone">
                        <dd class="hiddenUserid" style="display:none;">${item.userId}</dd>
                        <dd class="taskIcon" style="background-image:url(${item.head});">
                            <div class="hiddenHead" style="display:none;">${item.head}</div>
                        </dd>
            
                        <dd class="taskContent">
                            <div class="taskName">${item.nickname}</div>
                            <!-- taskName -->
                            <div class="taskContext">
                                <span class="message">${item.age} | ${item.job ? item.job : '暂无信息'} | 北京朝阳区</span>
                            </div>
                            <!-- taskContent -->
                        </dd>
                        <dd class="contentWrap">
                            <div class="redIcon">
                                ${self.haveWeidu(item)}
                                <span class="weiduMsg">${99}条未读</span>
                                </div>
                            <div class="plusMoney">
                                积分 : <span class="num">${null}</span>
                            </div>
                            
                        </dd>
                    </dl>`
            })
            $('.itemWrap .content').html(accountHtml)
        }

        this.getMsg = function () {
            var flag = true;
            $.each(this.userids, function (idx, item) {
                $.ajax({
                    url: "http://121.201.62.233:13888/delegate/msg/refresh/430032850?",
                    type: "POST",
                    async: false,
                    cache: true,
                    dataType: "json",
                    data: {
                        limit: "",
                        targetId:"",
                        token: token,
                        lastId: 0
                    },
                    success: function (data) {
                        console.log(data)
                        if (idx < 1) {
                            flag = false
                        }
                        if (!flag) {
                            $('.weiduMsg').eq(idx).html(data.content.length)
                        }
                    }
                })
            })

        }

        this.clickListItem = function () {
            var self = this;
            $('.content .item').tap(function () {
                var uid = $(this).find('.hiddenUserid').html()
                var nickname = encodeURIComponent($(this).find('.taskName').html())
                var myMSG = encodeURIComponent($(this).find('.message').html())
                var myHead = encodeURIComponent($(this).find('.hiddenHead').html())
                window.location.href = "http://192.168.25.126:8080/talk.html?uid=" + uid
                cookie.set('uid', uid, {
                    expire: 8
                })
                cookie.set('mcheck', md5('123456'), {
                    expire: 8
                })
                cookie.set('nickname', nickname, {
                    expire: 8
                })
                cookie.set('myMSG', myMSG, {
                    expire: 8
                })
                cookie.set('myHead', myHead, {
                    expire: 8
                })
            })
        }
        this.loadMoreStyle = function (text, opt, time) {
            $('.loadMore').text(text).animate(opt, time);
        }
        this.haveWeidu = function (item) {
            var have = ""
            if (item.weihui != 0) {
                have = '<div class="dian"></div>'
            } else {
                have = ""
            }
            return have
        }

    }

    function storageLoginStatus() {
        cookie.set('account', userName, {
            expire: 8
        })
        cookie.set('pwd', md5String, {
            expire: 8
        })
        cookie.set('token', token, {
            expire: 8
        })
    }
})


getSign({
    phone: 13716156938,
    password: "123456789",
    _expire: "1589358921956",
    logintype: "1"
})

function getSign(param) { // 获取签名   返回一个包含"?"的参数串
    var phone = param.phone;
    var password = param.password;
    var timeStamp = new Date().getTime();
    // 判断是否有参数
    if (param != null && param.length > 0) {
        param = "phone=" + phone + "&password=" + password + "&" + param;
    } else {
        param = "phone=" + phone + "&password=" + password
    }
    return "?phone=" + phone + "&logintype=1&password=" + password + "&code=&_expire=" + timeStamp + "&sign=" + calculateSign(param, phone);
}

// 生成sign
function calculateSign(param, securityKey) {
    var params = param.split("&");
    param = params.sort().join("").replace(/=/g, "");
    console.info(param);
    return sha1(param + securityKey).toUpperCase();
}