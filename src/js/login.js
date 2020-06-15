var $ = require('../libs/zepto')
var backIcon = require('../img/back.png')
var md5 = require('../libs/md5.js')
import "../css/login.scss"
import record from "./recoed"
var zuixin = []
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
        if (userName != cookie.get('account')) {
            localStorage.setItem('isFirst', true)
        }
        passWord = $('.password').val()
        md5String = md5(passWord);

        isLoginSucc()
        storageLoginStatus()
    })

    function loginController() {
        var ControllerData = {}
        $.ajax({
            url: "http://121.46.195.211:13888/delegate/login?",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                username: userName || cookie.get('account'),
                password: md5String || cookie.get('pwd')
            },
            success: function (response) {
                // console.log(response)
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
    if (localStorage.getItem('isFirst') == "false") {
        localStorage.setItem('isFirst', false)
    } else {
        localStorage.setItem('isFirst', true)
    }


    function LoginSuc() {
        this.flag = false;
        this.userAccount = [] // 该数组存储  20个账户和密码
        this.userids = [] // 该数组存储  20个账户的userid
        this.userContentSelf = []
        this.mcheckArr = []
        this.city = []
        this.auto = []
        this.index = 0;
        this.upDataArr = []
        this.getCityIndex = 0
        this.bb = JSON.parse(localStorage.getItem('bb')) || []
        this.init = function (arr) {
            var _this = this;
            this.userAccount = arr
            this.getuserContet()
            // this.getScorce()
            this.success()
            this.renderList()
            this.tapBack()
            // this.getCity()
            _this.callGetData() // TODO CALLDATA
            this.clickListItem()
            setInterval(function () {
                record.clearMaxLength(_this.userids, 100)
            }, 20000)
        }
        //存储账号id 和mcheck
        this.getuserContet = function (userid) {
            var _this = this;
            $.each(this.userAccount, function (idx, item) {
                _this.userids.push(item.userId)
            })
            $.ajax({
                url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
                type: "POST",
                dataType: "json",
                async: false,
                data: {
                    userIds: _this.userids.join(',')
                },
                success: function (data) {
                    for (var i = 0; i < _this.userAccount.length; i++) {
                        var userId = _this.userAccount[i].userId;
                        var userMCheck = _this.userAccount[i].userMCheck;
                        var contentValue = data.content;
                        var userInfo = contentValue[userId];
                        _this.mcheckArr.push(userMCheck);
                        _this.userContentSelf.push(userInfo);
                    }
                }
            })
        }
        this.success = function () {
            $('.title').html(` <div class="ListBack"><img src="${backIcon}" alt=""></div>账号列表`)
            $('.loginWrap').css('display', 'none');
            $('.itemWrap').css('display', 'block');
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
                accountHtml += `<dl id="u${item.userId}" class="item border-1px EverylastBorderDone">
                <dd class="hiddenUserid" style="display:none;">${item.userId}</dd>
                        <dd class="taskIcon" style="background-image:url(${item.head});">
                            <div class="hiddenHead" style="display:none;">${item.head}</div>
                        </dd>
                        <dd class="taskContent">
                            <div class="taskName">${item.nickname}</div>
                            <!-- taskName -->
                            <div class="taskContext">
                                <span class="message">${item.age} | ${item.job ? item.job : '暂无信息'} </span>
                            </div>
                            <!-- taskContent -->
                        </dd>
                        <dd class="contentWrap">
                            <div class="redIcon">
                            <div class="dian"></div>
                                <span class="weiduMsg"></span>
                                </div>
                            <div class="plusMoney"></div>
                        </dd>
                        <div class="hiddenMcheck" style="display:none;">${self.mcheckArr[index]}</div>
                        <div class="time" style="display:none;">0</div>
                        <div class="newId" style="display:none;">${zuixin[index] ? zuixin[index] : 0}</div>
                    </dl>`
            })
            $('.itemWrap .content').html(accountHtml)
            this.addRed()
        }
        this.FunSort = function (arr) {
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
        this.mySort = function (parent) {
            var newArr = [];
            var yepBack = [];
            var lastArr = [];
            // parent.forEach(function (item, index) {
            //     item.querySelectorAll('.dian')[0].getAttribute('style') == "display: block;" ? newArr.push(item) : yepBack.push(item);
            // })
            parent.sort(function (num1, num2) {
                var td = $(num1).attr("time");
                var td2 = $(num2).attr("time");
                var dian1 = $(num1).find('.dian').css('display');
                var dian2 = $(num2).find('.dian').css('display');
                var n1 = dian1 == "block" ? 1 : 0;
                var n2 = dian2 == "block" ? 1 : 0;
                if (n2 == n1) {
                    if (td < td2) {
                        return 1;
                    } else if (td == td2) {
                        return 0;
                    } else {
                        return -1;
                    }
                } else {
                    return n2 - n1;
                }
            })
            // var lastArr = this.FunSort(newArr).concat(this.FunSort(yepBack))
            $('.content').html(parent)
        }
        this.list = function (all) {
            var cache = []
            for (var ar of all) {
                if (cache.find(c => c.sendid == ar.sendid && c.targetid == ar.targetid)) {
                    continue
                }
                cache.push(ar)
            }
            return cache
        }
        this.autoMsg = function () {
            var _this = this;
            var arr = this.auto
            var all = [];
            var userId = this.userAccount
            var storage = JSON.parse(localStorage.getItem('list')) || [];
            for (var i = 0; i < this.auto.length; i++) {
                for (var j = 0; j < arr[i].length; j++) {
                    if (arr[i][j].content.string_tp == "QI:FlatterMsg") {
                        all.push({
                            targetid: arr[i][j].content.int64_user_id,
                            sendid: arr[i][j].content.int64_target_user_id
                        })
                    }
                }
            }
            var list = _this.list(all)

            var lastStep = []
            for (var a of list) {
                if (storage.find(c => c.sendid == a.sendid && a.targetid == c.targetid)) {
                    continue
                }
                lastStep.push(a)
            }
            for (var k = 0; k < lastStep.length; k++) {
                var index = k;
                $.ajax({
                    url: "http://121.46.195.211:13888/delegate/res/quickreplylist/" + lastStep[index].sendid,
                    async: true,
                    type: "GET",
                    success: function (re) {
                        var msg = re.content[0]
                        var mcheck = ""
                        for (var i = 0; i < _this.userAccount.length; i++) {
                            if (_this.userAccount[i].userId == lastStep[index].sendid) {
                                mcheck = _this.userAccount[i].userMCheck
                            }
                        }
                        if (msg) {
                            // console.log(mcheck)
                            $.ajax({
                                url: "http://121.46.195.211:13888/delegate/msg/send/private/" + lastStep[index].sendid,
                                async: true,
                                data: {
                                    mcheck: mcheck,
                                    content: msg,
                                    targetId: lastStep[index].targetid
                                },
                                success: function (a) {
                                    // console.log(a)
                                }
                            })
                        }
                    }
                })
            }
            localStorage.setItem('list', JSON.stringify(list.concat(lastStep)))
        }
        this.callGetData = function (t) {
            var _this = t || this;
            var userIds = _this.userids;
            var length = userIds.length;
            var len1 = length == 1 ? 1 : length / 2;
            var len2 = length;
            var callFunc1 = function (id, data, index) {
                if (index >= len1) {
                    _this.addRed()
                    setTimeout(function () {
                        _this.getData(_this, 0, callFunc1);
                    }, 1000);
                } else {
                    _this.getData(_this, index + 1, callFunc1);
                }
            }
            var callFunc2 = function (id, data, index) {
                //console.log("index:" + index)
                if (index >= len2) {
                    _this.addRed()
                    setTimeout(function () {
                        _this.getData(_this, len1, callFunc2);
                    }, 1000);
                } else {
                    _this.getData(_this, index + 1, callFunc2);
                }
            }

            if (len1 > 0) {
                this.getData(_this, 0, callFunc1);
            }

            if (len2 > 0) {
                this.getData(_this, len1, callFunc2);
            }

        }
        this.getData = function (t, index, callFunc) { // TODO DEFDATA
            var _this = t || this;
            //var id = _this.userids[_this.index]
            var id = _this.userids[index];
            $.ajax({
                url: "http://121.46.195.211:13888/delegate/msg/refresh/" + id,
                type: "POST",
                async: true,
                dataType: "json",
                data: {
                    limit: 100,
                    targetId: "",
                    token: token,
                    lastId: 0
                },
                success: function (data) {
                    record.updateReplyLastMsg(id, data)
                    callFunc(id, data, index);
                }

            })
        }
        this.addRed = function (t) {
            var _this = t || this;
            var userIds = _this.userids;
            for (var i in userIds) {
                var userId = userIds[i];
                var state = record.verifyReply(userId);
                var dom = $('#u' + userId);
                if (state) {
                    // 没红点
                    dom.find('.dian').css('display', 'none')
                } else {
                    // 有红点
                    dom.find('.dian').css('display', 'block')
                }
                var recode = record.getRecode(userId);
                var orderRecode = record.getOrderRecode(userId, recode);
                if (orderRecode && orderRecode.length > 0) {
                    dom.attr("time", orderRecode[0].time);
                }
            }
            var items = $(".content .item");
            _this.mySort(items);
        }
        this.clickListItem = function () {
            $('.content .item').tap(function () {
                var uid = $(this).find('.hiddenUserid').html()
                var nickname = encodeURIComponent($(this).find('.taskName').html())
                var myMSG = encodeURIComponent($(this).find('.message').html())
                var myHead = encodeURIComponent($(this).find('.hiddenHead').html())
                var myMcheck = $(this).find('.hiddenMcheck').html()
                // window.location.href = "http://123.57.87.160:80/cd/talk.html?uid=" + uid;
                window.location.href = `http://192.168.25.126:8080/talk.html?uid=${uid}`;
                cookie.set('uid', uid);
                cookie.set('mcheck', myMcheck)
                cookie.set('nickname', nickname)
                cookie.set('myMSG', myMSG)
                cookie.set('myHead', myHead)
                localStorage.setItem('num', $(this).index())
            })
        }
        this.loadMoreStyle = function (text, opt, time) {
            $('.loadMore').text(text).animate(opt, time);
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
        cookie.set('account', userName)
        cookie.set('pwd', md5String)
        cookie.set('token', token)
    }
})