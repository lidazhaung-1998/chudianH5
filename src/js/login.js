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
        this.mcheckArr = []
        this.init = function (arr) {
            this.userAccount = arr
            this.getuserContet()
            this.success()
            this.tapBack()
            this.clickListItem()
            this.getMsg()
            this.mySort()

        }
        this.getuserContet = function (userid) {
            var self = this;
            $.each(this.userAccount, function (index, userContent) {
                self.mcheckArr.push(userContent.userMCheck)
                $.ajax({
                    url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: {
                        userIds: userContent.userId
                    },
                    success: function (data) {
                        self.userContentSelf.push(data.content[userContent.userId])
                    }
                })
            })
        }
        this.success = function () {
            $('.title').html(` <div class="ListBack"><img src="${backIcon}" alt=""></div>
        账号列表`), $('.loginWrap').css('display', 'none');
            $('.itemWrap').css('display', 'block');
            this.renderList()
        }
        this.tapBack = function () {
            var self = this
            $('.ListBack').tap(function () {
                self.reloadLogin()
            })
        }



        this.renderList = function (item) {
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
                                <span class="message">${item.age} | ${item.job ? item.job : '暂无信息'}</span>
                            </div>
                            <!-- taskContent -->
                        </dd>
                        <dd class="contentWrap">
                            <div class="redIcon">
                                <span class="weiduMsg">${0}条信息</span>
                                </div>
                            <div class="plusMoney">
                                积分 : <span class="num">${null}</span>
                            </div>
                            
                        </dd>
                        <div class="hiddenMcheck" style="display:none;">${self.mcheckArr[index]}</div>
                    </dl>`
            })
            $('.itemWrap .content').html(accountHtml)
        }
        this.mySort = function () {
            var parent = Array.apply(Array, document.querySelectorAll('.content .item'))
            parent.sort(function (num1, num2) {
                if (num1.querySelectorAll('.item')[0]) {
                    var td = num1.querySelectorAll('.time')[0].innerText
                    var td2 = num2.querySelectorAll('.time')[0].innerText
                    if (td < td2) {
                        return 1
                    } else if (td == td2) {
                        return 0
                    } else {
                        return -1
                    }
                }

            })
            $('.content').html('')
            $('.content').html(parent)
        }
        this.getMsg = function () {
            var flag = true;
            var arr = [];
            var _this = this
            $.each(this.userAccount, function (idx, item) {
                $.ajax({
                    url: "http://121.201.62.233:13888/delegate/msg/refresh/" + item.userId + "?",
                    type: "POST",
                    async: false,
                    cache: true,
                    dataType: "json",
                    data: {
                        limit: "",
                        targetId: "",
                        token: token,
                        lastId: 0
                    },
                    success: function (data) {
                        console.log(data)
                        if (data.content.length) {
                            arr.push(data.content)
                        }
                        // if (idx < 1) {
                        //     flag = false
                        // }
                        // if (!flag) {
                        //     // 
                        //     var weiduNum = data.content.length
                        //     weiduNum > 99 ? weiduNum = 99 + "+" : weiduNum
                        //     $('.weiduMsg').eq(idx).html(weiduNum)
                        // }
                    }

                })

            })
            // localStorage.setItem('msg', JSON.stringify(arr))
            var obj = {}
            for (var i = 0; i < arr.length; i++) {
                $('.content .item').eq(i).append(`<div class="time" style="display:none;">${arr[i][0].content.int64_time}</div>`)
                $('.content .item').eq(i).find('.redIcon').prepend(this.haveWeidu(arr[i].length))
                for (var j = 0; j < arr[i].length; j++) {
                    if (obj[arr[i][j].content.int64_target_user_id]) {
                        obj[arr[i][j].content.int64_target_user_id]++
                    } else {
                        obj[arr[i][j].content.int64_target_user_id] = 1
                    }
                }

            }
            var idx = 0;
            for (var ar in obj) {
                if (obj[this.userids[idx]] != undefined) {
                    $('.weiduMsg').eq(idx).html(obj[this.userids[idx]])
                }
                idx++
            }
        }

        this.clickListItem = function () {
            $('.content .item').tap(function () {
                var uid = $(this).find('.hiddenUserid').html()
                var nickname = encodeURIComponent($(this).find('.taskName').html())
                var myMSG = encodeURIComponent($(this).find('.message').html())
                var myHead = encodeURIComponent($(this).find('.hiddenHead').html())
                var myMcheck = $(this).find('.hiddenMcheck').html()
                window.location.href = "http://192.168.25.126:8080/talk.html?uid=" + uid
                cookie.set('uid', uid, {
                    expire: 8
                })
                cookie.set('mcheck', myMcheck, {
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
                localStorage.setItem('num', $(this).index())
            })
        }
        this.loadMoreStyle = function (text, opt, time) {
            $('.loadMore').text(text).animate(opt, time);
        }
        this.haveWeidu = function (item) {
            var have = "";
            if (item != 0) {
                have = '<div class="dian"></div>'
            } else {
                have = ""
            }
            return have
        }
        // 退出登录
        this.reloadLogin = function () {
            $('.title').html('账号登录'), $('.loginWrap').css('display', 'block');
            $('.itemWrap').css('display', 'none')
            cookie.remove('pwd')
            cookie.remove('account')
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