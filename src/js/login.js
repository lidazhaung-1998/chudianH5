var $ = require('../libs/zepto')
var backIcon = require('../img/back.png')
var md5 = require('../libs/md5.js')
import "../css/login.scss"
import sha1 from "../libs/sha1"
var zuixin = []
document.onreadystatechange = completeLoading;
var la = JSON.parse(localStorage.getItem('la')) || []



function completeLoading() {
    if (document.readyState == "complete") {
        $('.loading').css('display', 'none')
    } else {
        $('.loading').css('display', 'block')
    }
}
completeLoading()
$(function () {
    localStorage.setItem('isFirst', true)
    if (JSON.parse(localStorage.getItem('bb'))) {
        localStorage.setItem('isFirst', false)
    }
    var oldM = oldM = JSON.parse(localStorage.getItem('oldM'));

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
    var a = [];

    function LoginSuc() {
        this.flag = false;
        this.userAccount = [] // 该数组存储  20个账户和密码
        this.userids = [] // 该数组存储  20个账户的userid
        this.userContentSelf = []
        this.mcheckArr = []
        this.scorce = []
        this.city = []
        this.auto = []
        this.bb = JSON.parse(localStorage.getItem('bb')) || []
        this.init = function (arr) {
            var _this = this;
            this.userAccount = arr
            this.getuserContet()
            this.success()
            this.renderList()
            this.tapBack()
            this.clickListItem()
            _this.abab()
            this.getMsg()
            // this.autoMsg()
            _this.removeDian()
            this.mySort()
            setTimeout(function () {
                _this.getuserContet()
                _this.renderList()
                _this.getMsg()
                _this.clickListItem()
                _this.mySort()
                _this.removeDian()
            }, 100)
            setInterval(function () {
                _this.getuserContet()
                _this.renderList()
                _this.getMsg()
                _this.clickListItem()
                _this.mySort()
                _this.removeDian()
            }, 3000)
        }
        this.abab = function () {
            var _this = this
            $.each($('.content .item'), function (index, item) {
                if (localStorage.getItem('isFirst') != "false") {
                    _this.bb.push({
                        text: $(this).find('.taskName').html(),
                        state: false,
                        id: 0
                    })
                } else {
                    if (_this.bb[index].text.indexOf($(this).find('.taskName').html()) == -1) {
                        _this.bb.push({
                            text: $(this).find('.taskName').html(),
                            state: false,
                            id: $(this).find('.newId').html()
                        })
                    }
                }
            })
            // console.log(_this.bb)
            localStorage.setItem('isFirst', false)
            localStorage.setItem('bb', JSON.stringify(_this.bb))
        }
        this.removeDian = function () {
            var _this = this
            for (var i = 0; i < this.bb.length; i++) {
                if (this.bb[i].state == true) {
                    $('.content .item').each(function (id, item) {
                        if ($(this).find('.taskName').html() == _this.bb[i].text) {
                            $(this).find('.dian').css('display', 'none')
                        }
                    })
                } else {
                    $('.content .item').each(function (id, item) {
                        if ($(this).find('.taskName').html() == _this.bb[i].text) {
                            $(this).find('.dian').css('display', 'block')
                        }
                    })
                }
            }
        }
        //存储账号id 和mcheck
        this.getuserContet = function (userid) {
            var self = this;
            var isUpDatapj = this.userAccount.length
            var isUpData = 0
            if (JSON.parse(localStorage.getItem('userContent')) != null) {
                isUpData = JSON.parse(localStorage.getItem('userContent')).length;
            }
            // console.log(this.userAccount)
            // 获取用户信息
            $.each(this.userAccount, function (index, userContent) {
                self.mcheckArr.push(userContent.userMCheck)
                $.ajax({
                    url: "http://cgi-base.evkeji.cn/sns/base/location/getLocation?",
                    type: "GET",
                    async: false,
                    data: {
                        userId: userContent.userId,
                        fromUserId: userContent.userId
                    },
                    success(data) {
                        self.city.push(data.content)
                    }
                })
                if (isUpDatapj > isUpData) {
                    $.ajax({
                        url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        data: {
                            userIds: userContent.userId
                        },
                        success: function (data) {
                            console.log(data)
                            self.userContentSelf.push(data.content[userContent.userId])
                        }
                    })
                }
                $.ajax({
                    url: "http://cgi-vas.evkeji.cn/sns/cash/userpoint/get?",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: {
                        userId: userContent.userId,
                        meck: userContent.userMCheck
                    },
                    success: function (req) {
                        self.scorce.push(req.content.balance)
                    }
                })

            })
            if (self.userContentSelf == false) {
                self.userContentSelf = JSON.parse(localStorage.getItem('userContent'))
            } else {
                localStorage.setItem('userContent', JSON.stringify(self.userContentSelf))
            }

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
                accountHtml += ` <dl class="item border-1px EverylastBorderDone">
                        <dd class="hiddenUserid" style="display:none;">${item.userId}</dd>
                        <dd class="taskIcon" style="background-image:url(${item.head});">
                            <div class="hiddenHead" style="display:none;">${item.head}</div>
                        </dd>
            
                        <dd class="taskContent">
                            <div class="taskName">${item.nickname}</div>
                            <!-- taskName -->
                            <div class="taskContext">
                                <span class="message">${item.age} | ${item.job ? item.job : '暂无信息'} | ${self.city[index].province+self.city[index].city}</span>
                            </div>
                            <!-- taskContent -->
                        </dd>
                        <dd class="contentWrap">
                            <div class="redIcon">
                            <div class="dian"></div>
                                <span class="weiduMsg"></span>
                                </div>
                            <div class="plusMoney">
                                积分 : <span class="num">${self.scorce[index]}</span>
                            </div>
                            
                        </dd>
                        <div class="hiddenMcheck" style="display:none;">${self.mcheckArr[index]}</div>
                        <div class="time" style="display:none;">0</div>
                        <div class="newId" style="display:none;">${zuixin[index] ? zuixin[index] : 0}</div>
                    </dl>`
            })
            this.scorce = []
            $('.itemWrap .content').html(accountHtml)
        }
        this.mySort = function () {
            var parent = $('.content .item')
            parent.sort(function (num1, num2) {
                var td = num1.querySelectorAll('.time')[0].innerText
                var td2 = num2.querySelectorAll('.time')[0].innerText
                if (td < td2) {
                    return 1
                } else if (td == td2) {
                    return 0
                } else {
                    return -1
                }

            })
            $('.content').html('')
            $('.content').html(parent)
        }
        this.autoMsg = function () {
            var _this = this;
            var arr = this.auto
            var all = []
            for (var i = 0; i < this.auto.length; i++) {
                for (var j = 0; j < arr[i].length; j++) {
                    if (arr[i][j].content.string_tp == "QI:FlatterMsg") {
                        console.log(arr[i][j])
                        all.push({
                            sendId: arr[i][j].content.int64_user_id,
                            targetid: arr[i][j].content.int64_target_user_id
                        })
                    }
                }
            }
            for (var i = 0; i < all.length; i++) {
                for (var j = i + 1; j < all.length; j++) {
                    if (all[i].sendId == all[j].sendId) {
                        all.splice(j, 1)
                    }
                }
            }
            for (var k = 0; k < all.length; k++) {
                $.ajax({
                    url: "http://121.201.62.233:13888/delegate/res/quickreplylist/" + all[k].targetid,
                    async: false,
                    type: "GET",
                    success: function (re) {
                        var msg = re.content[0]
                        var mcheck = ""
                        for (var i = 0; i < _this.userAccount.length; i++) {
                            if (_this.userAccount[i].userId == all[i].targetid) {
                                mcheck = _this.userAccount[i].userMCheck
                            }
                        }
                        if (msg) {
                            $.ajax({
                                url: "http://121.201.62.233:13888/delegate/msg/send/private/" + all[k].targetid,
                                async: false,
                                data: {
                                    mcheck: mcheck,
                                    content: msg,
                                    targetId: all[k].sendId
                                },
                                success: function (a) {
                                    console.log(a)
                                }
                            })
                        }
                    }
                })
            }
        }
        this.getMsg = function () {
            var arr = [];

            var obj = {}
            zuixin = []
            var _this = this
            $.each(this.userAccount, function (idx, item) {
                $.ajax({
                    url: "http://121.201.62.233:13888/delegate/msg/refresh/" + item.userId + "?",
                    type: "POST",
                    async: false,
                    dataType: "json",
                    data: {
                        limit: "",
                        targetId: "",
                        token: token,
                        lastId: 0
                    },
                    success: function (data) {
                        // console.log(data)
                        if (data.state != 0) {
                            alert('出错了~' + idx)
                        }
                        if (data.content.length) {
                            arr.push(data.content)
                            _this.auto.push(data.content)
                        }
                    }

                })
            })

            for (var i = 0; i < arr.length; i++) {
                zuixin.push(arr[i][0].id)
                $('.content .item .time').eq(i).html(arr[i][0].content.int64_time)
                if (la[i] != undefined) {
                    if (arr[i][0].id > la[i]) {
                        la[i] = arr[i][0].id
                        $('.content .item').each(function (index, item) {
                            if ($(this).find('.hiddenUserid').html() == arr[i][0].content.int64_target_user_id) {
                                var name = $(this).find('.taskName').html()
                                for (var l = 0; l < _this.bb.length; l++) {
                                    if (_this.bb[l].text.indexOf(name) != -1) {
                                        _this.bb[l].state = false
                                    }
                                }
                            }
                        })
                    }
                } else {
                    la.push(arr[i][0].id)
                }
                if ((arr[i][0].id - _this.bb[i].id) > 3) {
                    $('.content .item').each(function (ind, item) {
                        var name = $(this).find('.taskName').html()
                        if (_this.bb[i].text == name) {
                            _this.bb[i].state = false
                        }
                    })
                }
                for (var j = 0; j < arr[i].length; j++) {
                    if (arr[i][j].content.int64_target_user_id == _this.userAccount[i].userId) {
                        if (obj[arr[i][j].content.int64_target_user_id]) {
                            obj[arr[i][j].content.int64_target_user_id]++
                        } else {
                            obj[arr[i][j].content.int64_target_user_id] = 1
                        }
                    }

                }
            }
            localStorage.setItem('bb', JSON.stringify(_this.bb))
            // console.log(la)
        }
        this.clickListItem = function () {
            $('.content .item').tap(function () {
                var uid = $(this).find('.hiddenUserid').html()
                var nickname = encodeURIComponent($(this).find('.taskName').html())
                var myMSG = encodeURIComponent($(this).find('.message').html())
                var myHead = encodeURIComponent($(this).find('.hiddenHead').html())
                var myMcheck = $(this).find('.hiddenMcheck').html()
                var clickWho = $(this).find('.taskName').html()
                localStorage.setItem('clickWho', clickWho)
                var aa = JSON.parse(localStorage.getItem('bb'))
                for (var i = 0; i < aa.length; i++) {
                    if (aa[i].text.indexOf(clickWho) != -1) {
                        aa[i].id = parseInt($(this).find('.newId').html())
                    }
                }
                localStorage.setItem('bb', JSON.stringify(aa))
                // window.location.href = "http://page.qxiu.com/ldz/chudianh5/talk.html?uid=" + uid
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